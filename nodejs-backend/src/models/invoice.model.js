
    module.exports = function (app) {
        const modelName = 'invoice';
        const mongooseClient = app.get('mongooseClient');
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            name: { type:  String , required: true },
customer: { type: Schema.Types.ObjectId, ref: "customer" },
subtotal: { type:  String , required: true },
totalamount: { type:  String , required: true },
discount: { type:  String , required: true },
delivery: { type:  String , required: true },

            
            createdBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
            updatedBy: { type: Schema.Types.ObjectId, ref: "users", required: true }
          },
          {
            timestamps: true
        });
      
       
        if (mongooseClient.modelNames().includes(modelName)) {
          mongooseClient.deleteModel(modelName);
        }
        return mongooseClient.model(modelName, schema);
        
      };