-- Create products table for discount campaign
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  category text not null,
  regular_price decimal(10,2) not null,
  discount_price decimal(10,2) not null,
  image_url text,
  stock integer not null default 0,
  sku text unique not null,
  created_at timestamptz default now()
);

-- Enable RLS for products (read-only for public)
alter table public.products enable row level security;

-- Allow anyone to view products
create policy "products_select_all"
  on public.products for select
  using (true);

-- Only authenticated users can manage products (for future admin panel)
create policy "products_insert_authenticated"
  on public.products for insert
  with check (auth.uid() is not null);

create policy "products_update_authenticated"
  on public.products for update
  using (auth.uid() is not null);

create policy "products_delete_authenticated"
  on public.products for delete
  using (auth.uid() is not null);

-- Insert sample products
insert into public.products (name, description, category, regular_price, discount_price, image_url, stock, sku) values
('Commercial Convection Oven', 'Professional-grade 6-tray convection oven with digital controls', 'Ovens', 3500.00, 2450.00, '/placeholder.svg?height=400&width=400', 12, 'OVN-001'),
('Industrial Pizza Oven', 'Double-deck pizza oven with stone base, reaches 500°C', 'Ovens', 5200.00, 3640.00, '/placeholder.svg?height=400&width=400', 8, 'OVN-002'),
('Combi Steam Oven', '10-tray combi oven with steam injection system', 'Ovens', 8900.00, 6230.00, '/placeholder.svg?height=400&width=400', 5, 'OVN-003'),
('Walk-in Cooler Unit', 'Complete 8x10 walk-in cooler with refrigeration system', 'Cooling', 12000.00, 8400.00, '/placeholder.svg?height=400&width=400', 3, 'COOL-001'),
('Commercial Freezer', '3-door upright freezer, -18°C capacity', 'Cooling', 4800.00, 3360.00, '/placeholder.svg?height=400&width=400', 10, 'COOL-002'),
('Display Refrigerator', 'Glass door display fridge with LED lighting', 'Cooling', 2800.00, 1960.00, '/placeholder.svg?height=400&width=400', 15, 'COOL-003'),
('Blast Chiller', 'Rapid cooling system for food safety compliance', 'Cooling', 6500.00, 4550.00, '/placeholder.svg?height=400&width=400', 6, 'COOL-004'),
('Deck Oven', 'Single-deck baking oven with steam injection', 'Ovens', 4200.00, 2940.00, '/placeholder.svg?height=400&width=400', 9, 'OVN-004'),
('Rotisserie Oven', 'Vertical rotisserie with 8 spits, gas powered', 'Ovens', 3800.00, 2660.00, '/placeholder.svg?height=400&width=400', 7, 'OVN-005'),
('Ice Machine', '200kg daily production capacity with storage bin', 'Cooling', 3200.00, 2240.00, '/placeholder.svg?height=400&width=400', 11, 'COOL-005');
