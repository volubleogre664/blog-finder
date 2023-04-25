import app from "../main.js";

app.component("blog-card", {
  /* HTML */
  props: {
    blog: {
      type: Object,
      required: true,
    }
  },
  template: `
  <div class="search__resultsBlog">
    <h2>{{ blog.title }}</h2>
    <img src="{{ blog.img }}" alt="article banner">
    <p style="-webkit-box-orient: vertical;">{{ blog.description }}</p>
    <div class="info">
      <h4><b><i>by: </i></b>{{ blog.author }}</h4>
      <a href="{{ blog.url }}">Read</a>
    </div>
  </div>
    `,

  data() {
    return { };
  },

  methods: { },
});
