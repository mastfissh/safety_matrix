This is hosted at https://psychcombo.com/ .

It is open source, and written in astro. Contributions welcome. Mostly you'll want to do changes to src/content


Workflow to add new psychs - a 3 step process.

First, add them into the list of psychs, by creating a new mdx file in the folder https://github.com/mastfissh/safety_matrix/tree/main/src/content/psychoactives . 

Once that's merged in, the next step is to add them to https://github.com/mastfissh/safety_matrix/blob/main/public/risks.json . This involves coding a risk for each combination of the new one, and the existing ones.

Once that's done, it's a matter of adding any experiences of combos to https://github.com/mastfissh/safety_matrix/tree/main/src/content/combos . 

This should be done on a new branch, and merged once all data is finished.
