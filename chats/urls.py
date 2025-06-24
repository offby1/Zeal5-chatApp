from django.urls import path
from .views import chat_room,start_chat


urlpatterns = [
    path("chats/", chat_room, name="chats_page"),
    path("chats/<str:room_name>/", chat_room, name="chat_room"),
    path("start/chats/<str:username>/",start_chat, name="start_chat")
]
