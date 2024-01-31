/**
 * Configuration de Jest pour transformer les fichiers JSX en utilisant Babel.
 * @module jestConfig
 */

// Exporte la configuration par défaut de Jest
export default {
  /**
   * Configuration de la transformation des fichiers.
   * @property {object} transform - Configuration de la transformation des fichiers.
   */
  "transform": {
    /**
     * Utilisation de Babel-Jest pour transformer les fichiers JSX.
     * @property {string} transform["^.+\\.jsx?$"] - Babel-Jest est utilisé pour transformer les fichiers avec l'extension .jsx ou .js.
     */
    "^.+\\.jsx?$": "babel-jest"
  }
};
