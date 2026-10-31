# Data Analyst practice data

This fictional Asgard-authored dataset contains eight independent visits. It is
created for practice and describes no real people. Each row represents one visit;
the identifier is arbitrary and does not represent a person.

| Field | Meaning |
| --- | --- |
| visit_id | Unique visit identifier |
| week | Fictional week number |
| channel | Fictional web or referral source |
| minutes | Visit duration in whole minutes |
| completed | Whether the fictional task was completed |

Reference results: web has 4 visits, 3 completed, and a mean duration of 15
minutes. Referral has 4 visits, 2 completed, and a mean duration of 15 minutes.
Overall, 5 of 8 visits were completed. This tiny synthetic table cannot support
conclusions about actual users or causation.

For SQLite, import the CSV into a table named `visits`, then run:

```sql
SELECT channel, COUNT(*) AS visits,
       SUM(CASE WHEN completed = 'yes' THEN 1 ELSE 0 END) AS completions,
       AVG(minutes) AS mean_minutes
FROM visits GROUP BY channel ORDER BY channel;
```

For Calc, filter each channel and use COUNTIF on the channel and completion
columns, or create a pivot table grouped by channel with count and average of
minutes. Check each method against the reference results above.
