<template>
  <div>
    <v-list subheader>
      <v-subheader>
        Next Super Like timeslot: {{ nextSuperLikeTime }}
      </v-subheader>
      <link-item
        v-for="(l, index) in getLinkList"
        :id="l.id"
        :key="l.id"
        :url="l.sourceURL"
        :likee="l.likee"
        :index="index"
        :super-like-ts="nextSuperLikeTs + 43200000 * index"
        @remove="onRemoveLink"
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
      const ts = this.getUserInfo.nextSuperLikeTs || Date.now();
      const dateObj = new Date(ts);
      dateObj.setHours(dateObj.getHours() < 12 ? 0 : 12);
      dateObj.setMinutes(0);
      dateObj.setSeconds(0);
      dateObj.setMilliseconds(0);
      return dateObj.getTime();
    },
    nextSuperLikeTime() {
      if (!this.isLoggedIn) return 'Invalid';
      return new Date(this.nextSuperLikeTs).toString();
    },
  },
  mounted() {
    this.fetchLinks();
  },
  methods: {
    ...mapActions('link', ['fetchLinks', 'addNewLink', 'deleteLink']),
    onSubmitNewLink({ url, likee }) {
      this.addNewLink({
        sourceURL: url,
        likee,
        prevId: this.getLastLink ? this.getLastLink.id : null,
        nextId: null,
      });
    },
    onRemoveLink({ id }) {
      this.deleteLink({ id });
    },
  },
};
</script>
