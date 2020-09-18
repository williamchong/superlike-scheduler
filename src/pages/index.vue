<template>
  <v-layout justify-center align-center>
    <v-flex>
      <div v-if="!isLoggedIn">
        <a :href="getOAuthLoginAPI">Login</a>
      </div>
      <div v-else>
        <link-time-table />
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import { mapGetters } from 'vuex';
import { getOAuthLoginAPI } from '../util/api';
import LinkTimeTable from '../components/LinkTimeTable';

export default {
  components: {
    LinkTimeTable,
  },
  computed: {
    ...mapGetters('user', ['getUserId', 'getUserInfo']),
    getOAuthLoginAPI,
    isLoggedIn() {
      return this.getUserId;
    },
  },
};
</script>
