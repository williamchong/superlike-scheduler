<template>
  <div>
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
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import { mapActions, mapGetters } from 'vuex';
import LinkItem from './LinkItem';
import LinkInput from './LinkInput';

export default {
  components: {
    LinkItem,
    LinkInput,
  },
  computed: {
    ...mapGetters('user', ['getUserId', 'getUserInfo']),
    ...mapGetters('link', ['getLinkList', 'getLastLink']),
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
