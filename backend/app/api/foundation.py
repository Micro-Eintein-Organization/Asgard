"""Authenticated application operations using their owning feature services."""

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query, Request

from app.core.errors import ErrorBody
from app.core.security import Identity, current_identity
from app.modules.careers import service as careers_service
from app.modules.careers.schemas import Career, CareerPage, Category
from app.modules.discovery import service as discovery_service
from app.modules.discovery.schemas import (
    CompleteDiscovery,
    DiscoverySession,
    DiscoveryState,
    Questionnaire,
    RetakeDiscovery,
    SaveDiscovery,
    StartDiscovery,
)
from app.modules.progress import service as progress_service
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
from app.modules.recommendations import service as recommendations_service
from app.modules.recommendations.schemas import (
    RecommendationRun,
    RecommendationState,
    RequestRecommendations,
    RetryRecommendations,
)
from app.modules.roadmaps import service as roadmaps_service
from app.modules.roadmaps.schemas import Milestone, Resource, Roadmap, Topic
from app.modules.storage import transaction

Auth = Annotated[Identity, Depends(current_identity)]
Limit = Annotated[int, Query(ge=1, le=100)]
Offset = Annotated[int, Query(ge=0)]
router = APIRouter(
    tags=["foundation-contracts"],
    responses={status: {"model": ErrorBody} for status in (401, 404, 409, 422, 429, 503)},
)


@router.get(
    "/discovery/questionnaire",
    response_model=Questionnaire,
    operation_id="get_discovery_questionnaire",
)
async def get_questionnaire(request: Request, identity: Auth, questionnaire_id: UUID | None = None):
    async with transaction(request, identity) as connection:
        return await discovery_service.questionnaire(connection, questionnaire_id)


@router.get("/me/discovery", response_model=DiscoveryState, operation_id="get_my_discovery")
async def get_discovery(request: Request, identity: Auth):
    async with transaction(request, identity) as connection:
        return await discovery_service.state(connection, identity.user_id)


@router.post("/me/discovery", response_model=DiscoverySession, operation_id="start_my_discovery")
async def start_discovery(request: Request, body: StartDiscovery, identity: Auth):
    async with transaction(request, identity) as connection:
        return await discovery_service.start(connection, identity.user_id, body.questionnaire_id)


@router.get(
    "/me/discovery/{session_id}",
    response_model=DiscoverySession,
    operation_id="get_my_discovery_session",
)
async def get_discovery_session(request: Request, session_id: UUID, identity: Auth):
    async with transaction(request, identity) as connection:
        return await discovery_service.session(connection, identity.user_id, session_id)


@router.patch(
    "/me/discovery/{session_id}/answers",
    response_model=DiscoverySession,
    operation_id="save_my_discovery_answers",
)
async def save_discovery_answers(
    request: Request, session_id: UUID, body: SaveDiscovery, identity: Auth
):
    async with transaction(request, identity) as connection:
        return await discovery_service.checkpoint(connection, identity.user_id, session_id, body)


@router.post(
    "/me/discovery/{session_id}/complete",
    response_model=DiscoverySession,
    operation_id="complete_my_discovery",
)
async def complete_discovery(
    request: Request, session_id: UUID, body: CompleteDiscovery, identity: Auth
):
    async with transaction(request, identity) as connection:
        return await discovery_service.complete(connection, identity.user_id, session_id, body)


@router.post(
    "/me/discovery/retake",
    response_model=DiscoverySession,
    operation_id="retake_my_discovery",
)
async def retake_discovery(request: Request, body: RetakeDiscovery, identity: Auth):
    async with transaction(request, identity) as connection:
        return await discovery_service.retake(connection, identity.user_id, body)


@router.get("/me/dashboard", response_model=Dashboard, operation_id="get_my_dashboard")
async def get_dashboard(request: Request, identity: Auth):
    async with transaction(request, identity) as connection:
        return await progress_service.dashboard(connection, identity.user_id)


@router.get("/me/preferences", response_model=Preferences, operation_id="get_my_preferences")
async def get_preferences(request: Request, identity: Auth):
    async with transaction(request, identity) as connection:
        return await progress_service.preferences(connection, identity.user_id)


@router.patch("/me/preferences", response_model=Preferences, operation_id="save_my_preferences")
async def save_preferences(request: Request, body: SavePreferences, identity: Auth):
    async with transaction(request, identity) as connection:
        return await progress_service.save_preferences(connection, identity.user_id, body)


@router.get("/categories", response_model=list[Category], operation_id="list_categories")
async def list_categories(request: Request, identity: Auth):
    async with transaction(request, identity) as connection:
        return await careers_service.categories(connection)


@router.get("/careers", response_model=CareerPage, operation_id="list_careers")
async def list_careers(
    request: Request,
    identity: Auth,
    q: Annotated[str | None, Query(min_length=1, max_length=100)] = None,
    category_id: UUID | None = None,
    limit: Limit = 20,
    offset: Offset = 0,
):
    async with transaction(request, identity) as connection:
        return await careers_service.list_careers(connection, q, category_id, limit, offset)


@router.get("/careers/{career_id}", response_model=Career, operation_id="get_career")
async def get_career(request: Request, career_id: UUID, identity: Auth):
    async with transaction(request, identity) as connection:
        return await careers_service.career(connection, career_id)


@router.get("/roadmaps/{roadmap_id}", response_model=Roadmap, operation_id="get_roadmap")
async def get_roadmap(request: Request, roadmap_id: UUID, identity: Auth):
    async with transaction(request, identity) as connection:
        return await roadmaps_service.roadmap(connection, roadmap_id)


@router.get(
    "/roadmaps/{roadmap_id}/milestones",
    response_model=list[Milestone],
    operation_id="list_roadmap_milestones",
)
async def list_milestones(request: Request, roadmap_id: UUID, identity: Auth):
    async with transaction(request, identity) as connection:
        return await roadmaps_service.milestones(connection, roadmap_id)


@router.get(
    "/roadmaps/{roadmap_id}/topics/{topic_id}",
    response_model=Topic,
    operation_id="get_topic",
)
async def get_topic(request: Request, roadmap_id: UUID, topic_id: UUID, identity: Auth):
    async with transaction(request, identity) as connection:
        return await roadmaps_service.topic(connection, roadmap_id, topic_id)


@router.get(
    "/roadmaps/{roadmap_id}/topics/{topic_id}/resources",
    response_model=list[Resource],
    operation_id="list_topic_resources",
)
async def list_resources(request: Request, roadmap_id: UUID, topic_id: UUID, identity: Auth):
    async with transaction(request, identity) as connection:
        return (await roadmaps_service.topic(connection, roadmap_id, topic_id))["resources"]


@router.get(
    "/me/recommendations",
    response_model=RecommendationState,
    operation_id="get_my_recommendations",
)
async def get_recommendations(request: Request, identity: Auth):
    async with transaction(request, identity) as connection:
        return await recommendations_service.state(
            connection, identity.user_id, request.app.state.settings
        )


@router.post(
    "/me/recommendations",
    response_model=RecommendationRun,
    operation_id="request_my_recommendations",
    status_code=202,
)
async def request_recommendations(request: Request, body: RequestRecommendations, identity: Auth):
    return await recommendations_service.request_run(request, identity, body)


@router.get(
    "/me/recommendations/{run_id}",
    response_model=RecommendationRun,
    operation_id="get_my_recommendation_run",
)
async def get_recommendation_run(request: Request, run_id: UUID, identity: Auth):
    return await recommendations_service.get_run(request, identity, run_id)


@router.post(
    "/me/recommendations/{run_id}/retry",
    response_model=RecommendationRun,
    operation_id="retry_my_recommendations",
    status_code=202,
)
async def retry_recommendations(
    request: Request, run_id: UUID, body: RetryRecommendations, identity: Auth
):
    return await recommendations_service.retry(request, identity, run_id, body)


@router.get("/me/learning", response_model=LearningState, operation_id="get_my_learning_state")
async def get_learning_state(request: Request, identity: Auth):
    async with transaction(request, identity) as connection:
        return await progress_service.learning(connection, identity.user_id)


@router.patch(
    "/me/learning",
    response_model=LearningState,
    operation_id="select_my_current_roadmap",
)
async def select_roadmap(request: Request, body: SelectRoadmap, identity: Auth):
    async with transaction(request, identity) as connection:
        return await progress_service.select_roadmap(connection, identity.user_id, body)


@router.get(
    "/me/roadmaps/{roadmap_id}/progress",
    response_model=list[TopicProgress],
    operation_id="get_my_roadmap_progress",
)
async def get_progress(request: Request, roadmap_id: UUID, identity: Auth):
    async with transaction(request, identity) as connection:
        return await progress_service.progress(connection, identity.user_id, roadmap_id)


@router.patch(
    "/me/roadmaps/{roadmap_id}/topics/{topic_id}",
    response_model=TopicProgress,
    operation_id="save_my_topic_progress",
)
async def save_progress(
    request: Request,
    roadmap_id: UUID,
    topic_id: UUID,
    body: SaveTopicProgress,
    identity: Auth,
):
    async with transaction(request, identity) as connection:
        return await progress_service.save_progress(
            connection, identity.user_id, roadmap_id, topic_id, body
        )


@router.get(
    "/me/roadmaps/{roadmap_id}/branches",
    response_model=list[BranchChoice],
    operation_id="get_my_branch_choices",
)
async def get_branches(request: Request, roadmap_id: UUID, identity: Auth):
    async with transaction(request, identity) as connection:
        return await progress_service.branches(connection, identity.user_id, roadmap_id)


@router.patch(
    "/me/roadmaps/{roadmap_id}/branches/{group_id}",
    response_model=BranchChoice,
    operation_id="save_my_branch_choice",
)
async def save_branch(
    request: Request, roadmap_id: UUID, group_id: UUID, body: SaveBranchChoice, identity: Auth
):
    async with transaction(request, identity) as connection:
        return await progress_service.save_branch(
            connection, identity.user_id, roadmap_id, group_id, body
        )


@router.get(
    "/me/roadmaps/{roadmap_id}/summary",
    response_model=ProgressSummary,
    operation_id="get_my_progress_summary",
)
async def get_progress_summary(request: Request, roadmap_id: UUID, identity: Auth):
    async with transaction(request, identity) as connection:
        return await progress_service.summary(connection, identity.user_id, roadmap_id)


@router.get("/me/activity", response_model=ActivityMonth, operation_id="get_my_activity")
async def get_activity(
    request: Request,
    identity: Auth,
    month: Annotated[str, Query(pattern=r"^\d{4}-(0[1-9]|1[0-2])$")],
):
    async with transaction(request, identity) as connection:
        return await progress_service.activity(connection, identity.user_id, month)
