create table if not exists public.miniapp_kanban_cards (                                  
  id uuid primary key default gen_random_uuid(),                                          
  user_id uuid not null references auth.users(id) on delete cascade,                      
  title text not null,                                                                    
  description text not null default '',                                                   
  status text not null check (status in ('todo', 'doing', 'done')),                       
  position integer not null default 0,                                                    
  created_at timestamptz not null default now(),                                          
  updated_at timestamptz not null default now()                                           
);                                                                                        

create or replace function public.miniapp_kanban_set_updated_at()                         
returns trigger as $$                                                                     
begin                                                                                     
  new.updated_at = now();                                                                 
  return new;                                                                             
end;                                                                                      
$$ language plpgsql;                                                                      

drop trigger if exists trg_miniapp_kanban_cards_set_updated_at on                         
public.miniapp_kanban_cards;                                                              

create trigger trg_miniapp_kanban_cards_set_updated_at                                    
before update on public.miniapp_kanban_cards                                              
for each row                                                                              
execute function public.miniapp_kanban_set_updated_at();                                  

alter table public.miniapp_kanban_cards enable row level security;                        

drop policy if exists miniapp_kanban_cards_select_own on public.miniapp_kanban_cards;     
create policy miniapp_kanban_cards_select_own                                             
on public.miniapp_kanban_cards                                                            
for select                                                                                
to authenticated                                                                          
using ((select auth.uid()) = user_id);                                                    

drop policy if exists miniapp_kanban_cards_insert_own on public.miniapp_kanban_cards;     
create policy miniapp_kanban_cards_insert_own                                             
on public.miniapp_kanban_cards                                                            
for insert                                                                                
to authenticated                                                                          
with check ((select auth.uid()) = user_id);                                               

drop policy if exists miniapp_kanban_cards_update_own on public.miniapp_kanban_cards;     
create policy miniapp_kanban_cards_update_own                                             
on public.miniapp_kanban_cards                                                            
for update                                                                                
to authenticated                                                                          
using ((select auth.uid()) = user_id)                                                     
with check ((select auth.uid()) = user_id);                                               

drop policy if exists miniapp_kanban_cards_delete_own on public.miniapp_kanban_cards;     
create policy miniapp_kanban_cards_delete_own                                             
on public.miniapp_kanban_cards                                                            
for delete                                                                                
to authenticated                                                                          
using ((select auth.uid()) = user_id);                                                    

create index if not exists miniapp_kanban_cards_user_id_idx                               
on public.miniapp_kanban_cards(user_id);                                                  

create index if not exists miniapp_kanban_cards_user_status_position_idx                  
on public.miniapp_kanban_cards(user_id, status, position);   
