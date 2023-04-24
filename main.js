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
      console.log("Called updateBlogs");
    },
  },
});

export default app;
