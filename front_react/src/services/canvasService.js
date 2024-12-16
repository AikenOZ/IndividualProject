import fs from 'fs';
import path from 'path';

/**
 * CanvasService handles the addition of devices and conditions to the canvas.json file.
 */
class CanvasService {
  static canvasPath = path.resolve(__dirname, '../pages/canvas.json');

  /**
   * Adds a new device with conditions to the canvas JSON file.
   * @param {Object} device - Device data containing label, type, and conditions.
   */
  static async addDevice(device) {
    try {
      // Load existing canvas data
      const canvasData = JSON.parse(fs.readFileSync(CanvasService.canvasPath, 'utf-8'));

      // Create a unique ID for the new rule
      const newRuleId = `rule-${Date.now()}`;

      // Construct new rule structure
      const newRule = {
        id: newRuleId,
        name: device.label,
        device: {
          label: device.label,
          type: device.type,
          conditions: device.conditions.map(({ measurementField, state, value }) => ({
            field: measurementField,
            operator: state,
            value: value,
          })),
        },
        action: {
          label: "Send e-mail to",
          recipient: "new_user@example.com", // Default recipient, modify as needed
          type: "email",
        },
      };

      // Add the new rule to the existing rules
      canvasData.rules.push(newRule);

      // Save the updated data back to canvas.json
      fs.writeFileSync(CanvasService.canvasPath, JSON.stringify(canvasData, null, 2), 'utf-8');

      console.log(`New rule "${device.label}" added successfully.`);
    } catch (error) {
      console.error('Error adding new device:', error);
      throw error;
    }
  }
}

export default CanvasService;
