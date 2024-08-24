# Resume: An interactive, hierarchical resume

This repository is for an interactive resume built around a tree data structure.

Example:
https://pretoriusdre.github.io/resume

The resume looks just like a regular resume, and can be printed to pdf which you can submit normally. However, the pdf version includes a hyperlink back to the interactive version, and in that your ideas can *expand beyond the printed page*.

Each granular piece of information in the resume is represented by a node. Nodes can contain child notes, which could be expanded to reveal additional supporting information for the enquiring reader. You could include as much detailed information as you like. You can also reveal rich content such as images or embedded videos.

The resume has a built-in editor which allows you to update and rearrange nodes. Feel free to try this out. Export the JSON after you make your changes, this would need to be manually updated in your respository.


If you want to customise your resume to a particular job application, you can make your updates with the editor, saving the content to a new subfolder in the directory. Then you can reference this custom version using a url parameter such as `<BASE_URL>/?version=custom-for-xxxxx-role`




Deployment:


1. **Fork the Repository:**
    1. Click the "Fork" button at the top-right corner of this page.
    2. Choose a repository name. It is recommended to use 'resume'.

    If you have a free GitHub account, your url will be:

    `https://<username>.github.io/<repository-name>`



2. **Clone the Forked Repository:**
    1. On your GitHub account, navigate to your forked repository.
    2. Click the green "Code" button and copy the URL (either HTTPS or SSH).
    3. Open a terminal on your computer and run the following command to clone the repository:
        ```sh
        git clone <URL>
        ```
    
       Replace `<URL>` with the copied repository URL, (normally reusme).

3. **Navigate to the Repository:**
    ```sh
    cd <repository-name>
    ```
   Replace `<repository-name>` with the name of your repository.

4. **Install the required dependencies:**
    ```sh
    npm install
    ```

5. **Test out the resume on the local webserver**
    ```sh
    npm start
    ```

6. **Make Changes to the content:**
    - Use the editor to delete the first node. This will reset to a starter template.
    - Update the content as needed. Export the file as JSON, save into `/public/data/<yourname>/resume_content.json`
    - Update `/data/resume_metadata.json` to point to this new file.


7. **Commit and Push Changes:**
    ```sh
    git add .
    git commit -m "Describe your changes"
    git push origin master
    ```
    Make sure `master` is the correct branch name.


8. **Update GitHub Pages Settings:**
    1. Go to your forked repository on GitHub.
    2. Navigate to `Settings` > `Pages`.
    3. Under "Source," ensure it is set to the correct branch (`gh-pages`) and folder (typically `/root` or `/docs`).


9. **Commit and Push Changes:**
    ```sh
    git add .
    git commit -m "Describe your changes"
    git push origin master
    ```
    Make sure `master` is the correct branch name.


10. **Enable GitHub Pages:**
    - Ensure that GitHub Pages is enabled in the `Settings` > `Pages` section. Once the branch and folder are set correctly, GitHub will publish the pages automatically.


11. **Deploy your website**
    ```sh
    npm run deploy
    ```
After a short while your new resume should be online at
`https://<username>.github.io/<repository-name>`

12. **Resume versioning**

    The best resumes are customised to the role you are applying for. A great strategy is to have all your experiences listed inside in the 'master' resume (with unnecessary nodes set as hidden), and you use this as a template for the custom version. To customise, you would selectivly hide or collapse the items which are less relevant to the role you are applying for, before saving into a new JSON file.
    
    If you want to save your new file as a custom resume version, save it into the repository as follows:

    `/public/data/<yourname>/<version-name>/resume_content.json`

    The custom version is accessed by passing url parameters as follows:

    `https://<username>.github.io/<repository-name>/?version=<version-name>`