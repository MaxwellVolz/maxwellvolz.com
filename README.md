# MaxwellVolz.com

Personal Website for yours truly.

## TODO

### Model / ThreeJS Specific

- Interactive pieces
- Camera control
    - Directed transition on clicking certain elements
    - Restrict going below ground
    - Fly in on load
- Fix door (excludes don't export to jsx)
- Neon lights
- Replace arcade to avoid CC attribution
- Rooftop
    - Skylight
    - Billboards
- Cables
- Live text loading from somewhere
- Skybox

### Integrate

[Examples](https://docs.pmnd.rs/react-three-fiber/getting-started/examples)
[neon lights](https://codesandbox.io/s/pbwi6i)
[spotlights](https://codesandbox.io/s/tx1pq)
[ball scene](https://codesandbox.io/s/pj7zjq)

### General Web

- Favicon
- Complete all header fields
- Links to whatever

# 3d Models

## About

1. Models are made and skinned in *Sketchup* and exported as **.dae**
2. Import to *Blender* and exported as **.glb**
3. Compiled to **.jsx** using [gltfjsx](https://github.com/pmndrs/gltfjsx) for interactability with *ThreeJS*
    - Small rewrite required for integration with *React*
4. Models are kept in the **public** folder

### Making Models

- Sketchup
    - Make the models, or find .dae's online and import
- Blender
    - Make new scene, delete everything, import .dae
    - Export **.glb**
- Compile to **.jsx**

```sh
npx gltfjsx model.glb
```


### Hut Ideas

- Coffee Bar
- Halfpipe on roof
- Ladder to roof

### Good sites for free models

- [free models here!](https://www.cgtrader.com/)
- [free models here!](https://free3d.com/)
- [free models here!](https://www.turbosquid.com/Search/3D-Models/free)
- [free models here!](https://3dmdb.com/)
- [free models here!](http://www.yeggi.com/)
- [free models here!](https://www.myminifactory.com/)
- [free models here!](https://www.3dfindit.com/?lang=en_US)


---

## AWS

### Setup

1. [Install AWS CLI]()
2. Add credentials from **IAM** with *aws configure* in **terminal**


### Common Commands

```shell
# Delete local file
$ rm ./MyFile1.txt

# Attempt sync without --delete option - nothing happens
$ aws s3 sync build s3://wassuh.com/

# Sync with deletion - object is deleted from bucket
$ aws s3 sync build s3://wassuh.com/ --delete
delete: s3://wassuh.com/MyDirectory/MyFile1.txt
```
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
