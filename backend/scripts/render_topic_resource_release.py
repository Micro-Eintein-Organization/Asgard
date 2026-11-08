"""Render topic-specific resource corrections without changing learning identities."""
import json
from pathlib import Path
from urllib.parse import urlparse
from guide_resource_selections import SELECTIONS
from convert_guide_v4 import convert
from render_content_release import identifier, insert, literal
from render_guide_release import AT as OLD_AT, assertion

ROOT=Path(__file__).resolve().parents[1]
AT='2026-11-02T00:37:24+08:00'

def resources():
    evidence=json.loads((ROOT/'app/content/guide-resource-destinations.json').read_text())
    mapping={}
    for path in (ROOT / 'app/content/guide_v4' / f'{slug}.json' for slug in sorted(SELECTIONS)):
        raw=json.loads(path.read_text()); doc=convert(path)
        key=raw['career']['slug']; topics=[t for m in doc['roadmap']['milestones'] for t in m['topics']]
        selections=SELECTIONS[key]
        if len(topics)!=len(selections): raise ValueError(f'Incomplete selections: {key}')
        mapping[key]={}
        for topic,url in zip(topics,selections):
            e=evidence[url]
            if e.get('status')!=200 or not e.get('anchor_present'):
                raise ValueError(f'Unresolved destination: {url}')
            provider=urlparse(url).hostname
            access='Free documentation; software, hardware or service use may have separate requirements'
            mapping[key][topic['slug']]={'title':e['title'], 'provider':provider,'url':url,'kind':'documentation','is_free':True,
                'license':'External link only; publisher copyright retained; license audit not performed',
                'reviewed_at':e['checked_at'],'covers':[topic['slug']],
                'selection_note':f"Selected to support {topic['title']}. Shared lessons support related prerequisite, practice or project work; not a claim of exhaustive coverage.",
                'access':access}
    return mapping

def render():
    mapping=json.loads((ROOT/'app/content/topic-resources.json').read_text(encoding='utf-8')); changes=[]; checks=[]
    for path in (ROOT / 'app/content/guide_v4' / f'{slug}.json' for slug in sorted(SELECTIONS)):
        raw=json.loads(path.read_text()); doc=convert(path); key=raw['career']['slug']
        for m in doc['roadmap']['milestones']:
            for t in m['topics']:
                old=t['resources_pending_review']
                for index,r in enumerate(old):
                    kind=r['type'] if r['type'] in ('article','course','video','documentation','tool') else 'course' if 'course' in r['type'] else 'article'
                    expected={'id':identifier(f"resource/{t['id']}/{index}"),'topic_id':t['id'],'title':r['title'],'url':r['url'],'kind':kind,'is_free':False,
                        'license':'Access unverified; supplied access: '+r['access']+'; '+r['license_or_usage_notice']+'; reviewed_at records structural import only', 'reviewed_at':OLD_AT,'position':index}
                    changes.append(assertion('resources',expected))
                record=mapping[key][t['slug']]
                fields={k:record[k] for k in ('title','url','kind','is_free','license','reviewed_at')}
                fields['title']=t['title']+': '+record['title']
                fields.update(id=identifier(f"resource/{t['id']}/0"),topic_id=t['id'],position=0)
                changes.append('UPDATE asgard_catalog.resources SET '+','.join(f'{k}={literal(v)}' for k,v in fields.items())+' WHERE id='+literal(fields['id'])+';')
                for index in range(1,len(old)):
                    changes.append('DELETE FROM asgard_catalog.resources WHERE id='+literal(identifier(f"resource/{t['id']}/{index}"))+';')
                checks.append(insert('resources',fields))
                checks.append(f"DO $$ BEGIN IF (SELECT count(*) FROM asgard_catalog.resources WHERE topic_id={literal(t['id'])})<>1 THEN RAISE EXCEPTION 'Unexpected resource membership'; END IF; END $$;")
    return '\n'.join(['BEGIN;','SELECT pg_advisory_xact_lock(72611029);',
        "DO $resource_upgrade$ BEGIN IF NOT EXISTS(SELECT 1 FROM asgard_catalog.releases WHERE version=4) THEN IF NOT EXISTS(SELECT 1 FROM asgard_catalog.releases WHERE version=3) THEN RAISE EXCEPTION 'Missing release 3'; END IF;",
        *changes,'END IF; END $resource_upgrade$;',*checks,
        insert('releases',{'id':identifier('release/4'),'version':4,'published_at':AT}),'COMMIT;'])+'\n'

if __name__=='__main__':
    print(render())
