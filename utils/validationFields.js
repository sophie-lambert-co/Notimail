import validator from "validator";

/**
 * Fonction de validation des champs du modèle User.
 * @param {object} fieldsToValidate - Les champs à valider avec leurs valeurs.
 * @returns {array} - Un tableau d'erreurs de validation.
 */

function validateFields(fieldsToValidate) {
  const validationErrors = [];

  // Parcourez chaque champ et sa valeur dans fieldsToValidate
  for (const fieldName in fieldsToValidate) {
    // Utilisez une déclaration switch pour appliquer différentes validations en fonction du champ
    switch (fieldName) {
      case "firm_name":
        // Validation pour le champ firm_name
        if (!validator.isLength(fieldsToValidate[fieldName], { max: 45 })) {
          validationErrors.push(
            "Le champ firm_name doit avoir au maximum 45 caractères."
          );
        }
        break;
      case "first_name":
        // Validation pour le champ first_name
        if (!validator.isLength(fieldsToValidate[fieldName], { max: 25 })) {
          validationErrors.push(
            "Le champ first_name doit avoir au maximum 25 caractères."
          );
        }
        break;
      case "last_name":
        // Validation pour le champ last_name
        if (!validator.isLength(fieldsToValidate[fieldName], { max: 25 })) {
          validationErrors.push(
            "Le champ last_name doit avoir au maximum 25 caractères."
          );
        }
        break;
      case "email":
        // Validation pour le champ email (longueur maximale et format d'email)
        if (
          !validator.isEmail(fieldsToValidate[fieldName]) ||
          !validator.isLength(fieldsToValidate[fieldName], { max: 50 })
        ) {
          validationErrors.push(
            "Le champ email doit être une adresse email valide et avoir au maximum 50 caractères."
          );
        }
        break;
      case "phone_number":
        // Validation pour le champ phone_number (longueur maximale)
        if (!validator.isLength(fieldsToValidate[fieldName], { max: 25 })) {
          validationErrors.push(
            "Le champ phone_number doit avoir au maximum 25 caractères."
          );
        }
        break;
      case "password":
        // Validation pour le champ password (longueur fixe)
        if (
          !validator.isLength(fieldsToValidate[fieldName], { min: 4, max: 4 })
        ) {
          validationErrors.push(
            "Le champ password doit avoir exactement 4 caractères."
          );
        }
        break;
      case "last_received_mail":
      case "last_picked_up":
        // Validation pour les champs last_received_mail et last_picked_up (format de date)
        if (!validator.isDate(fieldsToValidate[fieldName])) {
          validationErrors.push(
            `Le champ ${fieldName} doit être une date valide.`
          );
        }
        break;
      case "has_mail":
      case "is_admin":
        // Validation pour les champs has_mail et is_admin (type boolean)
        if (typeof fieldsToValidate[fieldName] !== "boolean") {
          validationErrors.push(
            `Le champ ${fieldName} doit être de type boolean.`
          );
        }
        break;
      default:
        // Ajoutez ici la validation pour d'autres champs si nécessaire
        break;
    }
  }

  // Retournez le tableau d'erreurs de validation
  return validationErrors;
  
}

export default validateFields; // Exportez le modèle User pour pouvoir l'utiliser dans d'autres fichiers
