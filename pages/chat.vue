<template>
  <div class="DemoChat__container">
    <b-loading :is-full-page="false" v-model="isLoading"></b-loading>
    <b-sidebar position="static" mobile="mobile" open>
      <b-message type="is-info"> Your Room ID: {{ getMyRoomID() }} </b-message>
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
  </div>
</template>

<script>
import Chat from "@/plugins/chat";
import Vue from "vue";
import { Loading, Menu, Message, Sidebar } from "buefy";

Vue.use(Loading);
Vue.use(Sidebar);
Vue.use(Menu);
Vue.use(Message);

export default {
  data: function () {
    return {
      activeRoom: null,
      chat: new Chat(this.getMyRoomID(), {
        onReady() {
          this.isLoading = false;
        }
      }),
      isLoading: true
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
  },
  async mounted() {
    await this.chat.load();
  }
};
</script>

<style scoped>
.DemoChat__container {
  height: 100%;
  overflow: hidden;
  padding: var(--gutter-small);
  position: relative;
  width: 100%;
}
</style>
