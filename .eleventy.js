export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy("src/projects/**/images/**");
  eleventyConfig.addPassthroughCopy("print.html");
  eleventyConfig.addPassthroughCopy("_redirects");

  eleventyConfig.addCollection("projects", (api) =>
    api.getFilteredByTag("projects").sort((a, b) => b.date - a.date),
  );

  eleventyConfig.addFilter("readableDate", (d) =>
    d ? new Date(d).toLocaleDateString("en-GB", { year: "numeric", month: "long" }) : "",
  );

  return {
    dir: { input: "src", includes: "_includes", output: "_site" },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
