import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 60 }); // default TTL = 60 sec

export default cache;


// // GET /todos with cache
// router.get('/todos', async (req, res) => {
//     const key = 'todos';
//     const cachedTodos = cache.get(key);
  
//     if (cachedTodos) {
//       console.log('✅ Served from node-cache');
//       return res.json(cachedTodos);
//     }
  
//     const todos = await Todo.find();
//     cache.set(key, todos); // Cache the result for 60 sec (or default)
//     console.log('📡 Served from DB and cached');
//     res.json(todos);
// });
  
// // POST /todos - add and clear cache
// router.post('/todos', async (req, res) => {
//     const newTodo = new Todo(req.body);
//     await newTodo.save();

//     cache.del('todos'); // Invalidate cache
//     res.status(201).json(newTodo);
// });