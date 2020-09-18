<template>
  <v-layout justify-center align-center>
    <v-flex>
      <div v-if="!isLoggedIn">
        <a :href="getOAuthLoginAPI">Login</a>
      </div>
      <div v-else>
        <v-list subheader>
          <v-subheader>Next Super Like: {{ nextSuperLikeTime }}</v-subheader>
          <link-item
            v-for="(l, index) in getLinkList"
            :key="l.id"
            :url="l.sourceURL"
            :index="index"
            :super-like-ts="nextSuperLikeTs + 43200000 * index"
          />
        </v-list>
        <link-input @submit="onSubmitNewLink" />
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import { mapActions, mapGetters } from 'vuex';
import { getOAuthLoginAPI } from '../util/api';
import LinkItem from '../components/LinkItem';
import LinkInput from '../components/LinkInput';

export default {
  components: {
    LinkItem,
    LinkInput,
  },
  computed: {
    ...mapGetters('user', ['getUserId', 'getUserInfo']),
    ...mapGetters('link', ['getLinkList', 'getLastLink']),
    getOAuthLoginAPI,
    isLoggedIn() {
      return this.getUserId;
    },
    nextSuperLikeTs() {
      if (!this.isLoggedIn) return -1;
      const ts = this.getUserInfo.nextSuperLikeTs;
      if (!ts) return Date.now();
      return ts;
    },
    nextSuperLikeTime() {
      if (!this.isLoggedIn) return 'Invalid';
      const ts = this.getUserInfo.nextSuperLikeTs;
      if (!ts) return new Date().toString();
      return new Date(ts).toString();
    },
  },
  mounted() {
    this.fetchLinks();
  },
  methods: {
    ...mapActions('link', ['fetchLinks', 'addNewLink']),
    onSubmitNewLink({ url, likee }) {
      this.addNewLink({
        sourceURL: url,
        likee,
        prevId: this.getLastLink ? this.getLastLink.id : null,
        nextId: null,
      });
    },
  },
};
</script>
