# Employee Management System

A full-stack employee management application built with React, Node.js, and Express. Features CRUD operations for employee data with Excel file storage and password-protected operations.

## 🚀 Features

- **Full CRUD Operations**: Create, Read, Update, Delete employees
- **Password Protection**: Secure operations with password authentication
- **Excel Storage**: Data persistence using Excel files
- **Modern UI**: Clean, responsive React interface
- **API Documentation**: Swagger UI integration
- **Docker Support**: Containerized deployment
- **Security**: Rate limiting, CORS, input validation
- **Logging**: Comprehensive logging with Winston
- **Health Checks**: API health monitoring

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **XLSX** - Excel file handling
- **Joi** - Input validation
- **Winston** - Logging
- **Helmet** - Security headers
- **Express Rate Limit** - Rate limiting
- **Swagger UI** - API documentation

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool
- **Axios** - HTTP client
- **CSS3** - Styling

### DevOps
- **Docker** - Containerization
- **Nginx** - Web server (frontend)

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Docker (optional)

## 🚀 Quick Start

### Option 1: Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd react-nodeapp
   ```

2. **Create environment file**
   ```bash
   # Create .env file in frontend directory
   echo "VITE_EMPLOYEE_APP_PASSWORD=your-secure-password" > frontend/.env
   ```

3. **Run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Frontend: http://54.198.228.118
   - Backend API: http://54.198.228.118:3000
   - API Docs: http://54.198.228.118:3000/api-docs

### Option 2: Local Development

1. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   # Create .env file with password
   echo "VITE_EMPLOYEE_APP_PASSWORD=your-secure-password" > .env
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## 📚 API Documentation

### Base URL
```
http://54.198.228.118:3000/api/employees
```

### Endpoints

#### GET /api/employees
Get all employees
```bash
curl http://54.198.228.118:3000/api/employees
```

#### GET /api/employees/:id
Get employee by ID
```bash
curl http://54.198.228.118:3000/api/employees/1
```

#### POST /api/employees
Create new employee
```bash
curl -X POST http://54.198.228.118:3000/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "department": "Engineering"
  }'
```

#### PUT /api/employees/:id
Update employee
```bash
curl -X PUT http://54.198.228.118:3000/api/employees/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "email": "john.smith@example.com",
    "department": "Engineering"
  }'
```

#### DELETE /api/employees/:id
Delete employee
```bash
curl -X DELETE http://54.198.228.118:3000/api/employees/1
```

### Health Check
```bash
curl http://54.198.228.118:3000/health
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://54.198.228.118
```

#### Frontend (.env)
```env
VITE_EMPLOYEE_APP_PASSWORD=your-secure-password
VITE_API_URL=http://54.198.228.118:3000/api/employees
```

## 🛡️ Security Features

- **Password Protection**: All write operations require password
- **Input Validation**: Server-side validation with Joi
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configured for specific origins
- **Security Headers**: Helmet.js for security headers
- **Error Handling**: Comprehensive error handling and logging

## 📊 Data Storage

Employee data is stored in Excel files:
- **Location**: `backend/employees.xlsx`
- **Format**: JSON to Excel conversion
- **Backup**: Consider regular backups for production

## 🐳 Docker Configuration

### Backend Dockerfile
- Node.js 18 Alpine
- Optimized for production
- Health check support

### Frontend Dockerfile
- Multi-stage build
- Nginx for serving
- Optimized static files

## 📝 Logging

Logs are stored in the backend directory:
- `combined.log` - All logs
- `error.log` - Error logs only
- `employee.log` - Employee operation logs

## 🧪 Testing

```bash
# Backend tests (if implemented)
cd backend
npm test

# Frontend tests (if implemented)
cd frontend
npm test
```

## 🚀 Deployment

### Production Considerations

1. **Database**: Replace Excel with proper database (PostgreSQL, MongoDB)
2. **Authentication**: Implement JWT or session-based auth
3. **HTTPS**: Use SSL certificates
4. **Environment**: Set NODE_ENV=production
5. **Monitoring**: Add application monitoring
6. **Backup**: Implement data backup strategy

### Docker Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the API documentation at `/api-docs`
2. Review the logs in the backend directory
3. Open an issue on GitHub

## 🔄 Version History

- **v1.0.0**: Initial release with basic CRUD operations
- **v1.1.0**: Added security features and improved error handling
