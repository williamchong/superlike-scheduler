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
        :super-like-ts="nextSuperLikeTs + TWELVE_HOURS_IN_MS * index"
        @moveToTop="onMoveToTop"
        @remove="onRemoveLink"
      />
    </v-list>
    <link-input ref="linkInput" @submit="onSubmitNewLink" />
  </div>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import { mapActions, mapGetters } from 'vuex';
import LinkItem from './LinkItem';
import LinkInput from './LinkInput';

const TWELVE_HOURS_IN_MS = 43200000;

export default {
  components: {
    LinkItem,
    LinkInput,
  },
  data() {
    return {
      TWELVE_HOURS_IN_MS,
    };
  },
  computed: {
    ...mapGetters('user', ['getUserId', 'getUserInfo']),
    ...mapGetters('link', ['getLinkList', 'getFirstLink', 'getLastLink']),
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
    ...mapActions('link', [
      'fetchLinks',
      'addNewLink',
      'updateLink',
      'deleteLink',
    ]),
    async onSubmitNewLink({ url, likee, parentSuperLikeId }) {
      await this.addNewLink({
        sourceURL: url,
        likee,
        prevId: this.getLastLink ? this.getLastLink.id : null,
        nextId: null,
        parentSuperLikeId,
      });
      this.$refs.linkInput.clearInput();
    },
    onRemoveLink({ id }) {
      this.deleteLink({ id });
    },
    onMoveToTop({ id }) {
      if (!this.getFirstLink.id || id === this.getFirstLink.id) return;
      this.updateLink({ id, prevId: null, nextId: this.getFirstLink.id });
    },
  },
};
</script>
