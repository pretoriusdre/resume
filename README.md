# Resume: An interactive, hierarchical resume

This repository is for an interactive, web-based resume. The content is stored in a hierarchical tree, which can be interactively explored. Rich content such as images, videos, or other interactive elements are supported. Despite this, the resume is designed to be exportable to a conventional A4 page size pdf, with a link back to the interactive version. The resume also has an inbuilt editing tool which allows you to build the tree structure.

Example:
https://pretoriusdre.github.io/resume


Deployment:


1. **Fork the Repository:**
    1. Click the "Fork" button at the top-right corner of this page.
    2. Choose a repository name. It is recommended to use 'resume'.

If you have a free GitHub account, your url will be:
https://<username>.github.io/<repository-name>
eg pretoriusdre.github.io/resume


2. **Clone the Forked Repository:**
    1. On your GitHub account, navigate to your forked repository.
    2. Click the green "Code" button and copy the URL (either HTTPS or SSH).
    3. Open a terminal on your computer and run the following command to clone the repository:
        ```sh
        git clone <URL>
        ```
       Replace `<URL>` with the copied URL.

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
    - Update the content. Export the file as JSON, save into `/public/data/<yourname>/resume_content.json`
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


If you follow these steps, you will have successfully forked the repository and set up your own GitHub Pages site from the forked repo.