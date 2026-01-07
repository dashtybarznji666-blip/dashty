import { Router } from 'express';
import { ShoeController } from '../controllers/shoe.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { createShoeSchema, updateShoeSchema } from '../validators';

const router = Router();
const shoeController = new ShoeController();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /shoes:
 *   get:
 *     summary: Get all shoes
 *     tags: [Shoes]
 *     parameters:
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *         description: Number of records to skip
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *         description: Number of records to take
 *     responses:
 *       200:
 *         description: List of shoes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Shoe'
 */
router.get('/', (req, res) => shoeController.getAllShoes(req, res));

/**
 * @swagger
 * /shoes/{id}:
 *   get:
 *     summary: Get shoe by ID
 *     tags: [Shoes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Shoe details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Shoe'
 *       404:
 *         description: Shoe not found
 */
router.get('/:id', (req, res) => shoeController.getShoeById(req, res));

/**
 * @swagger
 * /shoes:
 *   post:
 *     summary: Create a new shoe
 *     tags: [Shoes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - brand
 *               - category
 *               - sizes
 *               - price
 *               - costPrice
 *               - sku
 *             properties:
 *               name:
 *                 type: string
 *               brand:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [men, women, kids]
 *               sizes:
 *                 type: array
 *                 items:
 *                   type: string
 *               price:
 *                 type: number
 *               costPrice:
 *                 type: number
 *               sku:
 *                 type: string
 *               description:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Shoe created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Shoe'
 *       400:
 *         description: Validation error or SKU already exists
 */
router.post('/', validate(createShoeSchema), (req, res) => shoeController.createShoe(req, res));

/**
 * @swagger
 * /shoes/{id}:
 *   put:
 *     summary: Update a shoe
 *     tags: [Shoes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               brand:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [men, women, kids]
 *               sizes:
 *                 type: array
 *                 items:
 *                   type: string
 *               price:
 *                 type: number
 *               costPrice:
 *                 type: number
 *               sku:
 *                 type: string
 *               description:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Shoe updated successfully
 *       404:
 *         description: Shoe not found
 */
router.put('/:id', validate(updateShoeSchema), (req, res) => shoeController.updateShoe(req, res));

/**
 * @swagger
 * /shoes/{id}:
 *   delete:
 *     summary: Delete a shoe
 *     tags: [Shoes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Shoe deleted successfully
 *       404:
 *         description: Shoe not found
 */
router.delete('/:id', (req, res) => shoeController.deleteShoe(req, res));

export default router;


