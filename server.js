
const app = express();

mongoose.connect(process.env.NODE_ENV==='development'?'mongodb://localhost/vidly':'mongodb+srv://aziziraheem:<@Azizi123>@cluster0-ydsji.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true })
.then(()=>console.log('Connected to MongoDB...'))
.catch((error)=>console.error('Cound not connect to MongoDB...'))

app.use(express.json());
app.use('/api/genres', genres)
app.use('/api/customers', customers)
app.use('/api/users', users)

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));