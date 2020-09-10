<template>
  <main class="redirect-page">
    <div class="my-48">
      <h1 class="text-24">{{ 'RedirectPage' }}</h1>
    </div>
  </main>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import { mapActions } from 'vuex';

export default {
  name: 'Redirect',
  async mounted() {
    const { error, state, code: authCode } = this.$route.query;
    if (authCode && state) {
      try {
        await this.postLoginToken({ authCode, state });
        this.$router.replace({ name: 'index' });
      } catch (err) {
        const errData = err.response || err;
        const errMessage = errData.data || errData.message || errData;
        console.error(errMessage); // eslint-disable-line no-console
        this.$nuxt.error({
          statusCode: errData.status || 400,
          message: errMessage,
        });
      }
    } else {
      this.$nuxt.error({
        statusCode: 400,
        message: error,
      });
    }
  },
  methods: {
    ...mapActions('user', ['postLoginToken']),
  },
};
</script>
