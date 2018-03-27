# First impressions

## The ZIP file

After receiving the email with instructions, I downloaded and unpacked the ZIP
file. Several things struck me as rather odd:

- The name of the ZIP file `Homework Assignment (1) (2) (2).zip` suggests that
  this particular file has been email around and downloaded several times.
  This gives a sloppy impression. It would be better to either have the ZIP file
  stored in a central place (so the name does not change) or to rename the file
  before sending it on.

- The contents of the ZIP file do not warrant "zipping" them. They only contained
  a PDF and a JSON file. These could just as easily be added individually as
  attachments to an email rather than needing to be zipped. Even better, both
  files could be placed in a separate repository and/or hosted individually.
  This would remove the need for an email attachment altogether. It would also
  make it possible for candidates to contribute improvements (for instance add
  clarification or fix typos).

- The ZIP file contains a `__MACOSX` folder and a `.DS_Store` file. These are
  leftovers from the ZIP being created on a Apple computer. Either the tool or
  the OS should be configured to _not_ add these files to the ZIP. Again, this
  gives a sloppy impression.


## The PDF document

At this point I opened the PDF file. From a readers perspective, the document
could also use some work.

### Contents

- Various aspects of the document are unclear and do not offer any further
  explanation. For instance: what is "the sort value" of a Restaurant? Is this
  the same as "Sort Option" or something else altogether? The introduction of
  the document states "you are able to search for restaurants." but requirements
  or specifications for "search" are not readily explained elsewhere in the
  document.

- The "Bonus" section does not explain if or why it should be implemented. It
  also describes a precise method of implementation rather than presenting a
  problem to be solved (for extra points?). This makes the bonus section
  contrast strongly with the rest of the text. Also, it does not entice or
  motivate me to implement it.

- Rather than stating "Include a readme file" it should suffice to say
  "document". Does it really matter what the file is called?

- The document does not clearly state what is expected of the reader and the
  scope of the assement is not explained. Is a quick-and-dirty version good
  enough? Are points added or subtracted for design? Is it acceptable to use a
  framework to do all the work rather than create a custom implementation? In
  it's current state, the document reads as a poorly pieced together set of
  requirements. If this was a document from a Product Owner it's status would
  resolutely be placed back to "Yet to be specified" and it would not make the
  sprint.

### Layout and makeup

- Some sections have headers while others do not. This creates an incoherent
  read.

- The list of requirements does not have it's digits in bold whilst the Bonus
  section does. This incosistency distacts from the text.

- Various elements in the document are emphasised in color (despite the fact
  that these elements are _not_ the most important element in that sentence).
  It is advised to simply use italics if bold is not an option. Using color
  interupts the flow of the reader.

### Writing style

- It is advised to avoid First-Person point of view for documentation. Avoid
  using "You" and "We".

- The Requirements are poorly described. Due to the lack of consistency
  (switching scope, tone and perspective), the requirements make an incoherent
  read.

- The tone and perspective of the text is inconsistent. For instance:
  The sentence "Use responsive layout" clashes with "Please visualize the name
  of the restaurants" (commanding vs. pleading) and "We expect valid test cases"
  (first-person vs. third-person perspective).

- The statement "All necessary data to complete this assignment is included in
  `Sample.json`" also annoys me. First of all, why is the sample document not
  named `sample.json` with a lower-case "S"? This _is_ the convention.
  Furthermore, would it be so much to ask for an example of the sample data? Do
  I really have to open the data file to figure out what the JSON structure is?
