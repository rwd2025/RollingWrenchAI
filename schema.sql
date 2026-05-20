CREATE TABLE IF NOT EXISTS clients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  credit_score INT CHECK (credit_score BETWEEN 300 AND 850)
);

CREATE TABLE IF NOT EXISTS vehicles (
  id SERIAL PRIMARY KEY,
  client_id INT REFERENCES clients(id) ON DELETE CASCADE,
  vin VARCHAR(17) UNIQUE NOT NULL,
  make VARCHAR(100),
  model VARCHAR(100),
  year INT,
  engine VARCHAR(100),
  esn VARCHAR(100),
  cpl VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS parts_inventory (
  sku VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  cost_price NUMERIC(10,2) DEFAULT 0,
  retail_price NUMERIC(10,2) DEFAULT 0,
  stock_quantity INT DEFAULT 0,
  warehouse_location VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS roadside_jobs (
  id SERIAL PRIMARY KEY,
  vehicle_id INT REFERENCES vehicles(id),
  status VARCHAR(50) DEFAULT 'dispatched',
  complaint TEXT,
  cause TEXT,
  correction TEXT,
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS labor_sessions (
  id SERIAL PRIMARY KEY,
  job_id INT REFERENCES roadside_jobs(id) ON DELETE CASCADE,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  hourly_rate NUMERIC(10,2) DEFAULT 145.00,
  accrued_billing NUMERIC(10,2) DEFAULT 0.00
);

CREATE TABLE IF NOT EXISTS financial_records (
  id SERIAL PRIMARY KEY,
  job_id INT REFERENCES roadside_jobs(id),
  type VARCHAR(20) CHECK (type IN ('quote','invoice')),
  total_parts_cost NUMERIC(10,2) DEFAULT 0,
  total_labor_cost NUMERIC(10,2) DEFAULT 0,
  grand_total NUMERIC(10,2) DEFAULT 0,
  payment_status VARCHAR(50) DEFAULT 'unpaid',
  financing_provider VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS repair_memory (
  id SERIAL PRIMARY KEY,
  vin VARCHAR(17),
  engine VARCHAR(100),
  fault_code VARCHAR(100),
  symptom TEXT,
  confirmed_fix TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
