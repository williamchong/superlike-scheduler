<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <v-card>
        <div v-if="isLoggedIn">
          {{ getUserId }}
        </div>
        <div v-else>
          <a :href="getOAuthLoginAPI">Login</a>
        </div>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import { mapGetters } from 'vuex';
import { getOAuthLoginAPI } from '../util/api';

export default {
  computed: {
    ...mapGetters('user', ['getUserId']),
    getOAuthLoginAPI,
    isLoggedIn() {
      return this.getUserId;
    },
  },
};
</script>
