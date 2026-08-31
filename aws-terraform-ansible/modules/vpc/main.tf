resource "aws_vpc" "this" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name        = var.vpc_name
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}
# ========================================
# Public Subnet A
# ========================================

resource "aws_subnet" "public_a" {
  vpc_id                  = aws_vpc.this.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "ap-south-1a"
  map_public_ip_on_launch = true

  tags = {
    Name        = "${var.vpc_name}-public-a"
    Environment = var.environment
    ManagedBy   = "Terraform"
    Tier        = "public"
  }
}

# ========================================
# Public Subnet B
# ========================================

resource "aws_subnet" "public_b" {
  vpc_id                  = aws_vpc.this.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "ap-south-1b"
  map_public_ip_on_launch = true

  tags = {
    Name        = "${var.vpc_name}-public-b"
    Environment = var.environment
    ManagedBy   = "Terraform"
    Tier        = "public"
  }
}

# ========================================
# Private Subnet A
# ========================================

resource "aws_subnet" "private_a" {
  vpc_id            = aws_vpc.this.id
  cidr_block        = "10.0.11.0/24"
  availability_zone = "ap-south-1a"

  tags = {
    Name        = "${var.vpc_name}-private-a"
    Environment = var.environment
    ManagedBy   = "Terraform"
    Tier        = "private"
  }
}

# ========================================
# Private Subnet B
# ========================================

resource "aws_subnet" "private_b" {
  vpc_id            = aws_vpc.this.id
  cidr_block        = "10.0.12.0/24"
  availability_zone = "ap-south-1b"

  tags = {
    Name        = "${var.vpc_name}-private-b"
    Environment = var.environment
    ManagedBy   = "Terraform"
    Tier        = "private"
  }
}

# ========================================
# Internet Gateway
# ========================================

resource "aws_internet_gateway" "this" {
  vpc_id = aws_vpc.this.id

  tags = {
    Name        = "${var.vpc_name}-igw"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# ========================================
# Public Route Table
# ========================================

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.this.id

  tags = {
    Name        = "${var.vpc_name}-public-rt"
    Environment = var.environment
    ManagedBy   = "Terraform"
    Tier        = "public"
  }
}

# ========================================
# Public Internet Route
# ========================================

resource "aws_route" "public_internet" {
  route_table_id         = aws_route_table.public.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.this.id
}


# ========================================
# Public Subnet A Association
# ========================================

resource "aws_route_table_association" "public_a" {
  subnet_id      = aws_subnet.public_a.id
  route_table_id = aws_route_table.public.id
}


# ========================================
# Public Subnet B Association
# ========================================

resource "aws_route_table_association" "public_b" {
  subnet_id      = aws_subnet.public_b.id
  route_table_id = aws_route_table.public.id
}


# ========================================
# Elastic IP for NAT Gateway
# ========================================

resource "aws_eip" "nat" {
  domain = "vpc"

  tags = {
    Name        = "${var.vpc_name}-nat-eip"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}


# ========================================
# NAT Gateway
# ========================================

resource "aws_nat_gateway" "this" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public_a.id

  tags = {
    Name        = "${var.vpc_name}-nat"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }

  depends_on = [aws_internet_gateway.this]
}


# ========================================
# Private Route Table
# ========================================

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.this.id

  tags = {
    Name        = "${var.vpc_name}-private-rt"
    Environment = var.environment
    ManagedBy   = "Terraform"
    Tier        = "private"
  }
}


# ========================================
# Private Internet Route via NAT
# ========================================

resource "aws_route" "private_nat" {
  route_table_id         = aws_route_table.private.id
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id          = aws_nat_gateway.this.id
}


# ========================================
# Private Subnet A Association
# ========================================

resource "aws_route_table_association" "private_a" {
  subnet_id      = aws_subnet.private_a.id
  route_table_id = aws_route_table.private.id
}


# ========================================
# Private Subnet B Association
# ========================================

resource "aws_route_table_association" "private_b" {
  subnet_id      = aws_subnet.private_b.id
  route_table_id = aws_route_table.private.id
}