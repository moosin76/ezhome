<template>
  <div>
    <h1>토스트 테스트</h1>
    <div>
      <v-btn @click="toastTest1">토스트 Info</v-btn>
      <v-btn @click="toastTest2">토스트 Success</v-btn>
      <v-btn @click="toastTest3">토스트 Error</v-btn>
      <v-btn @click="toastTest4">토스트 Warning</v-btn>
      <v-btn @click="toastTest5">전역에러</v-btn>
    </div>
    <h1>프로그레스 테스트</h1>
    <div>
      <v-btn @click="barTest1">Start</v-btn>
      <v-btn @click="barTest2">Finish</v-btn>
      <v-btn @click="barTest3">Fail</v-btn>
    </div>
    <h1>Notify 테스트</h1>
    <div>
      <v-btn @click="notifyTest1">Alert</v-btn>
      <v-btn @click="notifyTest2">Confirm</v-btn>
      <v-btn @click="notifyTest3">Prompt</v-btn>
    </div>
    <h1>Axios 테스트</h1>
    <div>
      <v-btn @click="axiosTest1">Test</v-btn>
      <v-btn @click="axiosTest2">Error</v-btn>
    </div>
    <h1>Socket 테스트</h1>
    <div>
      <v-btn @click="joinRoom('testroom')">룸 입장</v-btn>
      <v-btn @click="leaveRoom('testroom')">룸 퇴장</v-btn>
      <v-btn @click="sendMsg1">전체 보내기</v-btn>
      <v-btn @click="sendMsg2">전체 브로드캐스팅 보내기</v-btn>
      <v-btn @click="sendMsg3">룸 보내기</v-btn>
      <v-btn @click="sendMsg4">룸 브로드캐스팅 보내기</v-btn>
    </div>
    <div>{{ $store.state.config.test1 }}</div>
    <h1>Chat 테스트</h1>
    <div>
      <v-text-field v-model="toId" label="아이디"></v-text-field>
      <v-text-field v-model="chatMsg" label="메세지"></v-text-field>
      <v-btn @click="chatTest">메세지 전송</v-btn>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "Home",
  data() {
    return {
      title: "My App",
      toId: "",
      chatMsg: "",
    };
  },
  title() {
    return this.title;
  },
  socket() {
    return {
      "room:testmsg": (data) => {
        console.log("room:testmsg", data);
      },
      "chat:test": (data) => {
        console.log("chat:test", data);
      },
    };
  },
  methods: {
    ...mapActions("socket", ["joinRoom", "leaveRoom"]),
    toastTest1() {
      this.$toast.info("Hello Info");
    },
    toastTest2() {
      this.$toast.success("Hello success");
    },
    toastTest3() {
      this.$toast.error("Hello error");
    },
    toastTest4() {
      this.$toast.warning("Hello warning");
    },
    toastTest5() {
      throw new Error("전역 에러");
    },
    barTest1() {
      this.$Progress.start();
    },
    barTest2() {
      this.$Progress.finish();
    },
    barTest3() {
      this.$Progress.fail();
    },
    async notifyTest1() {
      const res = await this.$ezNotify.alert("테스트 내용입니다.", "안내", {
        icon: "mdi-video-4k-box",
      });
      console.log(res);
    },
    async notifyTest2() {
      const res = await this.$ezNotify.confirm("테스트 내용입니다.", "");
      console.log(res);
    },
    async notifyTest3() {
      const res = await this.$ezNotify.prompt(
        "테스트 내용입니다.",
        "프롬프트",
        { width: 200 }
      );
      console.log(res);
    },
    async axiosTest1() {
      const result = await this.$axios.get("/api/member/test");
      console.log(result);
    },
    async axiosTest2() {
      const result = await this.$axios.get("/api/error");
      console.log(result);
    },
    sendMsg1() {
      this.$socket.emit("room:msg", {
        msg: "접속된 모든 소켓에 메시지를 보냅니다.",
        target: 1,
      });
    },
    sendMsg2() {
      this.$socket.emit("room:msg", {
        msg: "나를 제외한 모든 소켓에 메세지를 보냅니다.",
        target: 2,
      });
    },
    sendMsg3() {
      this.$socket.emit("room:msg", {
        msg: "룸에 입장한 모든 소켓에 메세지를 보냅니다.",
        target: 3,
      });
    },
    sendMsg4() {
      this.$socket.emit("room:msg", {
        msg: "룸에 나를 제외한 소켓에 메세지를 보냅니다.",
        target: 4,
      });
    },
    chatTest() {
      const { toId, chatMsg } = this;
      const { member } = this.$store.state.user;
      if (member) {
        this.$socket.emit("chat:test", {
          toId,
          chatMsg,
          fromId: member.mb_id,
        });
      }
    },
  },
};
</script>
