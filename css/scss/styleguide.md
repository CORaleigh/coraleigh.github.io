<h1 class="style-guide-title">Style Guide</h1>

Welcome to the ***CLIENT-NAME*** style guide, the best resource for folks interested in writing code for ***CLIENT-NAME***. We have a living style guide that documents both markup and appearance. This guide serves as a resource to bring together all our brands and to help define their visual and stylistic elements.

<section class="table-of-contents">
	<h2 class="table-of-contents-title">Table of Contents</h2>
	<section class="guide-branding">
		<h3>[Branding](section-branding.html)</h3>
		Features and characteristics that identifies distinct appearances of the organization(s). Branding includes logo, color, typography, iconography, and more.
	</section>
	<section class="guide-elements">
		<h3>[Elements](section-elements.html)</h3>
		Core, common elements that are the building blocks for components. Elements are typically self-contained and cannot be broken down further.
	</section>
	<section class="guide-components">
		<h3>[Components](section-components.html)</h3>
		Modular, complex building blocks that incorporates multiple elements. Components may also contain additional logic and/or interactions.
	</section>
	<section class="guide-layouts">
		<h3>[Layouts](section-layouts.html)</h3>
		Structural compositions that the system can use to build out web pages. These compositions will be explained further as they relate to various devices and resolutions.
	</section>
</section>

<section class="for-developers">
	<h2 class="developers-title">For Developers</h2>
	<p>The style guide is built using <a href="http://warpspire.com/kss/" target="_blank"><strong>Knyle Style Sheets</strong></a>. KSS focuses on how people work with CSS — it does not define code structures, naming conventions, or methods for abstraction. It is important to understand that the styleguide format and documentation format are intrinsically tied to one another.</p>
	<p>Because we use CSS preprocessors, the following format is used as a guideline when creating or modifying KSS documentation:</p>
<pre class="prettyprint linenums lang-html">
<code data-language="scss">
// A button suitable for giving stars to someone.
//
// :hover             - Subtle hover highlight.
// .stars-given       - A highlight indicating you've already given a star.
// .stars-given:hover - Subtle hover highlight on top of stars-given styling.
// .disabled          - Dims the button to indicate it cannot be used.
//
// Styleguide Elements - Buttons

a.button.star{
  ...
  &.star-given{
    ...
  }
  &.disabled{
    ...
  }
}
</code>
</pre>
	<p>All documentation comments can be found throughout the various SCSS partials for the project.</p>
	<p><strong>It is strongly recommended to constantly document any development that involves UI elements of any sort.</strong></p>
</section>
