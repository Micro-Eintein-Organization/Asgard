"""Discoverable Stage 4 contracts, deliberately without feature services."""

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query

from app.core.errors import APIError, ErrorBody
from app.core.security import Identity, current_identity
from app.modules.careers.schemas import Career, CareerPage, Category
from app.modules.discovery.schemas import (
    CompleteDiscovery,
    DiscoverySession,
    DiscoveryState,
    Questionnaire,
    RetakeDiscovery,
    SaveDiscovery,
    StartDiscovery,
)
from app.modules.progress.schemas import (
    ActivityMonth,
    BranchChoice,
    Dashboard,
    LearningState,
    Preferences,
    ProgressSummary,
    SaveBranchChoice,
    SavePreferences,
    SaveTopicProgress,
    SelectRoadmap,
    TopicProgress,
)
from app.modules.recommendations.schemas import (
    RecommendationRun,
    RecommendationState,
    RequestRecommendations,
    RetryRecommendations,
)
from app.modules.roadmaps.schemas import Milestone, Resource, Roadmap, Topic

Auth = Annotated[Identity, Depends(current_identity)]
Limit = Annotated[int, Query(ge=1, le=100)]
Offset = Annotated[int, Query(ge=0)]
router = APIRouter(
    tags=["foundation-contracts"],
    responses={status: {"model": ErrorBody} for status in (401, 404, 409, 422, 429, 501, 503)},
)


def unfinished():
    raise APIError(501, "not_implemented", "This feature operation is not implemented yet.")


@router.get(
    "/discovery/questionnaire", response_model=Questionnaire,
    operation_id="get_discovery_questionnaire",
)
async def get_questionnaire(identity: Auth):
    unfinished()


@router.get("/me/discovery", response_model=DiscoveryState, operation_id="get_my_discovery")
async def get_discovery(identity: Auth):
    unfinished()


@router.post("/me/discovery", response_model=DiscoverySession, operation_id="start_my_discovery")
async def start_discovery(body: StartDiscovery, identity: Auth):
    unfinished()


@router.get(
    "/me/discovery/{session_id}", response_model=DiscoverySession,
    operation_id="get_my_discovery_session",
)
async def get_discovery_session(session_id: UUID, identity: Auth):
    unfinished()


@router.patch(
    "/me/discovery/{session_id}/answers", response_model=DiscoverySession,
    operation_id="save_my_discovery_answers",
)
async def save_discovery_answers(session_id: UUID, body: SaveDiscovery, identity: Auth):
    unfinished()


@router.post(
    "/me/discovery/{session_id}/complete", response_model=DiscoverySession,
    operation_id="complete_my_discovery",
)
async def complete_discovery(session_id: UUID, body: CompleteDiscovery, identity: Auth):
    unfinished()


@router.post(
    "/me/discovery/retake", response_model=DiscoverySession, operation_id="retake_my_discovery",
)
async def retake_discovery(body: RetakeDiscovery, identity: Auth):
    unfinished()


@router.get("/me/dashboard", response_model=Dashboard, operation_id="get_my_dashboard")
async def get_dashboard(identity: Auth):
    unfinished()


@router.get("/me/preferences", response_model=Preferences, operation_id="get_my_preferences")
async def get_preferences(identity: Auth):
    unfinished()


@router.patch("/me/preferences", response_model=Preferences, operation_id="save_my_preferences")
async def save_preferences(body: SavePreferences, identity: Auth):
    unfinished()


@router.get("/categories", response_model=list[Category], operation_id="list_categories")
async def list_categories(identity: Auth):
    unfinished()


@router.get("/careers", response_model=CareerPage, operation_id="list_careers")
async def list_careers(
    identity: Auth,
    q: Annotated[str | None, Query(min_length=1, max_length=100)] = None,
    category_id: UUID | None = None,
    limit: Limit = 20,
    offset: Offset = 0,
):
    unfinished()


@router.get("/careers/{career_id}", response_model=Career, operation_id="get_career")
async def get_career(career_id: UUID, identity: Auth):
    unfinished()


@router.get("/roadmaps/{roadmap_id}", response_model=Roadmap, operation_id="get_roadmap")
async def get_roadmap(roadmap_id: UUID, identity: Auth):
    unfinished()


@router.get(
    "/roadmaps/{roadmap_id}/milestones", response_model=list[Milestone],
    operation_id="list_roadmap_milestones",
)
async def list_milestones(roadmap_id: UUID, identity: Auth):
    unfinished()


@router.get(
    "/roadmaps/{roadmap_id}/topics/{topic_id}", response_model=Topic, operation_id="get_topic",
)
async def get_topic(roadmap_id: UUID, topic_id: UUID, identity: Auth):
    unfinished()


@router.get(
    "/roadmaps/{roadmap_id}/topics/{topic_id}/resources", response_model=list[Resource],
    operation_id="list_topic_resources",
)
async def list_resources(roadmap_id: UUID, topic_id: UUID, identity: Auth):
    unfinished()


@router.get(
    "/me/recommendations", response_model=RecommendationState,
    operation_id="get_my_recommendations",
)
async def get_recommendations(identity: Auth):
    unfinished()


@router.post(
    "/me/recommendations", response_model=RecommendationRun,
    operation_id="request_my_recommendations", status_code=202,
)
async def request_recommendations(body: RequestRecommendations, identity: Auth):
    unfinished()


@router.get(
    "/me/recommendations/{run_id}", response_model=RecommendationRun,
    operation_id="get_my_recommendation_run",
)
async def get_recommendation_run(run_id: UUID, identity: Auth):
    unfinished()


@router.post(
    "/me/recommendations/{run_id}/retry", response_model=RecommendationRun,
    operation_id="retry_my_recommendations", status_code=202,
)
async def retry_recommendations(run_id: UUID, body: RetryRecommendations, identity: Auth):
    unfinished()


@router.get("/me/learning", response_model=LearningState, operation_id="get_my_learning_state")
async def get_learning_state(identity: Auth):
    unfinished()


@router.patch(
    "/me/learning", response_model=LearningState, operation_id="select_my_current_roadmap",
)
async def select_roadmap(body: SelectRoadmap, identity: Auth):
    unfinished()


@router.get(
    "/me/roadmaps/{roadmap_id}/progress", response_model=list[TopicProgress],
    operation_id="get_my_roadmap_progress",
)
async def get_progress(roadmap_id: UUID, identity: Auth):
    unfinished()


@router.patch(
    "/me/roadmaps/{roadmap_id}/topics/{topic_id}", response_model=TopicProgress,
    operation_id="save_my_topic_progress",
)
async def save_progress(
    roadmap_id: UUID, topic_id: UUID, body: SaveTopicProgress, identity: Auth,
):
    unfinished()


@router.get(
    "/me/roadmaps/{roadmap_id}/branches", response_model=list[BranchChoice],
    operation_id="get_my_branch_choices",
)
async def get_branches(roadmap_id: UUID, identity: Auth):
    unfinished()


@router.patch(
    "/me/roadmaps/{roadmap_id}/branches/{group_id}", response_model=BranchChoice,
    operation_id="save_my_branch_choice",
)
async def save_branch(roadmap_id: UUID, group_id: UUID, body: SaveBranchChoice, identity: Auth):
    unfinished()


@router.get(
    "/me/roadmaps/{roadmap_id}/summary", response_model=ProgressSummary,
    operation_id="get_my_progress_summary",
)
async def get_progress_summary(roadmap_id: UUID, identity: Auth):
    unfinished()


@router.get("/me/activity", response_model=ActivityMonth, operation_id="get_my_activity")
async def get_activity(
    identity: Auth, month: Annotated[str, Query(pattern=r"^\d{4}-(0[1-9]|1[0-2])$")],
):
    unfinished()
