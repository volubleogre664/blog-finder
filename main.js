const app = Vue.createApp({
  data() {
    return {
      blogs: [],
      isNewSearch: true,
    };
  },
  methods: {
    updateBlogs(blogs) {
      this.blogs = blogs;
    },
  },
});

export default app;
