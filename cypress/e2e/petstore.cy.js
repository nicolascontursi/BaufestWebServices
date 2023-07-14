const Ajv = require('ajv').default;
const ajv = new Ajv({ allErrors: true });
require('ajv-formats')(ajv);

// Definimos un pequeño schema esperado para el response
const petSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' }
  },
  required: ['id'] 
};

describe('Test Suite', () => {
  it('Agregar mascota', () => {
    // Realizar una solicitud POST a /v2/pet para agregar una mascota
    cy.request('POST', 'https://petstore.swagger.io/v2/pet', {
      // Datos de la mascota
    }).then((response) => {
      // Status code esperado
      expect(response.status).to.eq(200);

      // Schema del response
      const validateResponse = ajv.compile(petSchema);
      const isValid = validateResponse(response.body);
      expect(isValid).to.be.true;
    });
  });

  it('Obtener mascota existente', () => {
    // Realizar una solicitud GET a /v2/pet/{petId} para obtener una mascota existente
    cy.request('GET', 'https://petstore.swagger.io/v2/pet/2').then((response) => {
      // Status code esperado
      expect(response.status).to.eq(200);

      // Schema del response
      const validateResponse = ajv.compile(petSchema);
      const isValid = validateResponse(response.body);
      expect(isValid).to.be.true;
    });
  });

  it('Modificar una mascota existente', () => {
    //Modificar una mascota existente mediante PUT al path /v2/pet.
    cy.request('PUT', 'https://petstore.swagger.io/v2/pet', {
      id: 3, // ID de la mascota a modificar
      name: 'Tommy', // Nuevo nombre de la mascota
      status: 'available' // Nuevo estado de la mascota
    }).then((response) => {
      // Status code esperado
      expect(response.status).to.equal(200);
  
      // Schema del response
      const validateResponse = ajv.compile(petSchema);
      const isValid = validateResponse(response.body);
      expect(isValid).to.be.true;
    });
  });
});
