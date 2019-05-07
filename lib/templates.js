const vm = require('vm');
const fs = require('fs');
const path = require('path');
 
/** @class Templates
 * Loads and caches ejs-style templates for later rendering
 */
class Templates {
 
  /** @constructor
   * Constructs a new Templates instance, sychronously loading
   * the templates in the supplied directory.
   * @param {string} templateDirectory - the directory of templates to load
   */
  constructor(templateDirectory) {
    this.templates = {}
    var templateFiles = fs.readdirSync(templateDirectory);
    templateFiles.forEach((filename) => {
      var templatePath = path.join(templateDirectory, filename);
      var templateData = fs.readFileSync(templatePath, {encoding: "utf-8"});
      var templateName = path.basename(filename, ".ejs");
      this.templates[templateName] = templateData;
    });
  }
 
  /** @method render
   * Renders the specified template using the supplied context
   * @param {string} template - the template name
   * @param {object} context - key/value pairs corresponding to variable names/values
   * @returns {string|null} - the rendered template string, or null on error.
   */
  render(template, context) {
    const templateText = this.templates[template];
 
    // If the template doesn't exist, return null;
    if(!templateText) return null;
 
    // Otherwise, try returning rendering the template
    try {
      // The regular expression matches all <%= %> pairs
      // (the g flag is for global matching, and the s flag allows . to match newlines)
      // the . means any character, the * means none or many, and the ? makes this greedy
      // (stop looking as soon as a closing %> is found).
      return templateText.replace(/<%=(.*?)%>/gs, (match, code) => {
        // Replace each match with the executed code
        return vm.runInNewContext(code, context);
      });
    } catch (err) {
      // if there was an error rendering the template,
      // log it and return null
      console.error(`Error rendering template: ${template}:`, err);
      return null;
    }
  }
}
 
module.exports = Templates;