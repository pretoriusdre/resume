# `resume-tree`: An interactive, hierarchical resume
## Overview:

This repository is a template for an interactive resume built around a tree data structure. This is an open-source project that you can fork, fill with your own details, and host on github pages for free.

Example:
https://pretoriusdre.github.io/resume-tree/




https://github.com/user-attachments/assets/71a4762d-c72c-4097-8ef8-b378e35be974




The resume looks just like a regular resume, and can be printed to a pdf which you can submit normally. However, the pdf version includes a hyperlink back to the interactive version, where ideas can *expand beyond the printed page*.


Each granular piece of information in the resume is represented by a node. Nodes can contain child notes, which a curious reader could expand to reveal additional supporting information. You could include as much detailed information as you like, at any depth level. You can also reveal rich content such as images or embedded videos, which themselves can be represented by nodes.

The resume has a built-in editor which allows you to update and rearrange nodes. Feel free to try this feature; it does not affect the content on the webserver. Export the JSON after you make your local changes. If you want to persist these changes, save that file in your repository, replacing the existing file


If you want to customise your resume to a particular job application, you can make your updates with the editor, saving the content to a new subfolder in the directory. Then you can reference this custom version using a url parameter such as `<site-url>/?version=custom-for-xxxxx-role`


## Setup:
Prerequisites: You will need to install [NodeJS](https://nodejs.org/en) and an IDE.

1. **Fork the repository:**
    1. Click the "Fork" button at the top-right corner of this page.
    2. Choose a repository name. It is recommended to use 'resume', as this choice affects the site url on GitHub Pages.
        - If you don't have a custom domain, your GitHub Pages site url will be: `<site-url> = https://<username>.github.io/<repository-name>`
        - 
2. **Update GitHub Pages settings:**
    1. Go to your forked repository on GitHub.
    2. Navigate to `Settings` > `Pages`.
    3. Enable GitHub Pages.
    4. Under "Source," ensure it is set to GitHub Actions. The associated settings for this are in `./.github/workflows/gh-pages.yml`
    5. If you would like to set up a custom domain, you should enter this information here.

3. **Check the deployment of your website**
    - After a short while your new resume should be online at:

        `https://<username>.github.io/<repository-name>`

    - If you encounter any issue, check the deployment logs at 
        `https://github.com/<username>/<repository-name>/actions`

Now that your resume is online, it is time to fill it with content...
      
4. **Clone the forked repository:**
    1. Navigate to your forked repository.
    2. Click the green "Code" button and copy the URL (either HTTPS or SSH).
    3. Open a terminal on your computer and run the following command to clone the repository:
        ```sh
        git clone <repository-url>
        ```
    
       Replace `<repository-url>` with the copied repository URL.

5. **Navigate to the repository:**
    
    ```sh
    cd <repository-name>
    ```
   Replace `<repository-name>` with the name of your repository, eg `resume`

6. **Install the required dependencies:**
    ```sh
    npm install
    ```


7. **Test out the resume on the local webserver**
    ```sh
    npm start
    ```
    -The webserver should normally be accessible from http://localhost:3000/resume

    -After you have confirmed it is working locally, close the webserver with Ctrl+C


8. **Make local changes to the resume:**
    - Make a local development branch:
    ```shf
    git checkout -b mydev
    ```
    
    - Run the webserver again.
    - Use the editor to reset the page to a starter template.
    `(Navbar) > Edit > Start New`
    - Update the content as needed. Export the file as JSON, save into `./public/data/<yourname>/resume_content.json`
    - Update `./public/data/resume_metadata.json` to point to this new file that you exported and saved into the correct location.
    - Re-run the webserver and check that the resume is showing the new content.


9. **Commit and push changes to dev:**
    ```sh
    git add .
    git commit -m "Describe your changes"
    git push origin mydev
    ```

10. **Merge the changes into the main branch:**

    - Since `main` branch automatically deploys the site, a branch protection rule has been setup. You may need to merge your branch with a pull request.

    - You can raise and approve your own pull request into your own repository at:
     `https://github.com/<username>/<repository-name>/actions`

    - If you prefer, you can turn off branch protection rules on your own repo.


11. **Resume versioning**

    - The best resumes are customised to the role you are applying for.
    - A great strategy is to have all your experiences listed inside in the base resume (with nodes set as hidden as required), and you use this as a template to create the custom version.
    - To customise, you would selectively hide or collapse the items which are less relevant to the role you are applying for, or unhiding nodes which provide useful detail.
    - After customisation for the role, you would then save that version into a new JSON file, saving it into the repository as follows:

        `/public/data/<yourname>/<version-name>/resume_content.json`

    - The custom version is accessed by passing a `version` parameter in the url:

        `https://<username>.github.io/<repository-name>/?version=<version-name>`


## Contributing:

- If you would like to contribute, first raise a bug report or feature request under the GitHub issues.
- You can then submit your proposed changes via pull request.


## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
