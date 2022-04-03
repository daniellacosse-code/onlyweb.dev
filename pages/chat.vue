<template>
  <div v-if="ready">
    <h1 class="title">Your Room ID: {{ getMyRoomID() }}</h1>
    <b-sidebar position="static" mobile="mobile">
      <b-menu>
        <b-menu-list label="chats" v-if="chat.rooms.length">
          <b-menu-item
            v-for="room in chat.rooms"
            :key="room.id"
            :active="room.id === activeRoom"
            @click="activeRoom = room.id"
            :label="room.id"
          >
          </b-menu-item>
        </b-menu-list>
        <b-menu-list label="actions">
          <b-menu-item
            icon="add"
            label="Enter Room"
            @click="enterRoom"
          ></b-menu-item>
        </b-menu-list>
      </b-menu>
    </b-sidebar>
    <!-- TODO: render chat -->
  </div>
</template>

<script>
import Chat from "@/plugins/chat";

export default {
  data: function () {
    return {
      activeRoom: null,
      chat: new Chat(this.getMyRoomID(), {
        onReady() {
          this.ready = true;
        }
      }),
      ready: false
    };
  },
  methods: {
    async enterRoom() {
      const roomID = prompt("Enter Friend's RoomID");

      await this.chat.loadRoom(roomID);
    },
    getMyRoomID() {
      if (!localStorage.getItem("My Room ID")) {
        localStorage.setItem(
          "My Room ID",
          btoa(Math.random() * Number.MAX_SAFE_INTEGER)
        );
      }

      return localStorage.getItem("My Room ID");
    }
  }
};
</script>
