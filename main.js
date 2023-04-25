const app = Vue.createApp({
  data() {
    return {
      blogs: [],
      blogSources: [
        { name: "dev.to", url: "dev.to" },
        { name: "css-tricks", url: "css-tricks.com" },
        { name: "freecodecamp", url: "freecodecamp.org" },
        { name: "codepen", url: "codepen.io" },
        { name: "hashnode", url: "hashnode.com" },
        { name: "smashingmagazine", url: "smashingmagazine.com" },
        { name: "hongkiat", url: "hongkiat.com" },
      ],
      searchStr: "",
      isNewSearch: true,
    };
  },

  methods: {
    updateBlogs(blogs) {
      this.blogs = blogs;
    },

    updateSearchStr(searchStr) {
      this.searchStr = searchStr;
      console.log(this.searchStr);
    },
  },
});

export default app;
