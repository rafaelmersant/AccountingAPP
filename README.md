This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Actualizaciones del frontend

En producción, la aplicación consulta `asset-manifest.json` al abrirse y al
cambiar de ruta. Si los archivos JS o CSS publicados difieren de los cargados
en esa pestaña, abre automáticamente la URL de destino con `_appVersion` para
evitar el HTML almacenado en caché. No requiere cerrar el navegador ni hacer
hard refresh. La recarga reemplaza el estado en memoria de la página de destino.

Publicar todo el contenido de `build`, incluido `asset-manifest.json`, en cada
despliegue, preferiblemente de forma atómica. Configurar el hosting/CDN para
revalidar `index.html` y `asset-manifest.json` (`Cache-Control: no-cache`), y
respetar los parámetros de consulta en las claves de caché del HTML. Los archivos
con hash de `static/` pueden conservar caché prolongada. No se registra un
service worker. Las pestañas que todavía ejecutan una versión anterior a esta
mejora necesitan una recarga inicial para incorporar el mecanismo.

Verificar este mecanismo con `npm run test:deployment` (Node 18 o superior).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
