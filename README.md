# Resume: An interactive, hierarchical resume

This repository is for an interactive resume built around a tree data structure.

Example:
https://pretoriusdre.github.io/resume/?version=sample

The resume looks just like a regular resume, and can be printed to pdf which you can submit normally. However, the pdf version includes a hyperlink back to the interactive version, where ideas can *expand beyond the printed page*.

Each granular piece of information in the resume is represented by a node. Nodes can contain child notes, which an enquiring reader could expand to reveal additional supporting information. You could include as much detailed information as you like, at any depth level. You can also reveal rich content such as images or embedded videos, which themselves can be represented by nodes.

The resume has a built-in editor which allows you to update and rearrange nodes. Feel free to try this feature, it does not affect the content on the webserver. Export the JSON after you make your local changes. If you want to persist these changes, save that file in your repository over the existing file.


If you want to customise your resume to a particular job application, you can make your updates with the editor, saving the content to a new subfolder in the directory. Then you can reference this custom version using a url parameter such as `<site-url>/?version=custom-for-xxxxx-role`


### Setup:


1. **Fork the repository:**
    1. Click the "Fork" button at the top-right corner of this page.
    2. Choose a repository name. It is recommended to use 'resume', as this affects your site url.
        - If you don't have a custom domain, your site url will be: `<site-url> = https://<username>.github.io/<repository-name>`

2. **Clone the forked repository:**
    1. Navigate to your forked repository.
    2. Click the green "Code" button and copy the URL (either HTTPS or SSH).
    3. Open a terminal on your computer and run the following command to clone the repository:
        ```sh
        git clone <repository-url>
        ```
    
       Replace `<repository-url>` with the copied repository URL.

3. **Navigate to the repository:**
    
    ```sh
    cd <repository-name>
    ```
   Replace `<repository-name>` with the name of your repository, eg `resume`

4. **Install the required dependencies:**
    ```sh
    npm install
    ```

5. **Update GitHub Pages settings:**
    1. Go to your forked repository on GitHub.
    2. Navigate to `Settings` > `Pages`.
    3. Enable GitHub Pages.
    4. Under "Source," ensure it is set to GitHub Actions. The associated settings for this are in `./.github/workflows/gh-pages.yml`
    5. If you have a custom domain, you can enter this information here.
    6. Note down the public url you are using, you will need to update this in the repository.


6. **Test out the resume on the local webserver**
    ```sh
    npm start
    ```
    -The webserver should normally be accessible from http://localhost:3000/resume
    -After you have confirmed it is working locally, close the webserver with Ctrl+C


7. **Make local changes to the resume:**
    - Make a local development branch:
    ```sh
    git checkout -b mydev
    ```
    - Update `.package.json`, changing the `homepage` parameter to your github public url.

    - Run the webserver again.
    - Use the editor to reset the page to a starter template.
    `(Navbar) > Edit > Start New`
    - Update the content as needed. Export the file as JSON, save into `./public/data/<yourname>/resume_content.json`
    - Update `./public/data/resume_metadata.json` to point to this new file that you exported and saved into the correct location.
    - Re-run the webserver and check that the resume is showing the new content.


8. **Commit and push changes to dev:**
    ```sh
    git add .
    git commit -m "Describe your changes"
    git push origin mydev
    ```

9. **Merge the changes into main:**

    - Since `main` branch automatically deploys the site, a branch protection rule has been setup. You will need to merge your branch with a pull request.

    - You can raise and approve your own pull request into your own repositoy at:
     `https://github.com/<username>/<repository-name>/actions`

    - If you prefer, you can turn off branch protection rules on your own repo.

10. **Check the deployment of your website**
    - After a short while your new resume should be online at:

        `https://<username>.github.io/<repository-name>`

    - If you encounter any issue, check the deployment logs at 
        `https://github.com/<username>/<repository-name>/actions`

11. **Resume versioning**

    - The best resumes are customised to the role you are applying for.
    - A great strategy is to have all your experiences listed inside in the base resume (with nodes set as hidden as requried), and you use this as a template to create the custom version.
    - To customise, you would selectivly hide or collapse the items which are less relevant to the role you are applying for, or unhiding nodes which provide useful detail.
    - After customisation for the role, you would then save that version into a new JSON file, saving it into the repository as follows:

        `/public/data/<yourname>/<version-name>/resume_content.json`

    - The custom version is accessed by passing a `version` parameter in the url:

        `https://<username>.github.io/<repository-name>/?version=<version-name>`