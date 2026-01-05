export interface Event {
  id: number;
  title: string;
  category: string;
  region: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  image_url: string;
  organizer: string;
  website_url: string;
  is_free: boolean;
  price: string;
  source_url?: string;
}

export interface Review {
  id: number;
  rating: number;
  content: string;
  created_at: string;
  user_email: string;
}

export interface Visit {
  id: number;
  event_id: number;
  visited_at: string;
  content: string;
  images: string[];
  decoration_metadata: Record<string, unknown> | null;
  event?: Event;
}

export interface Like {
  id: number;
  likeable_type: "Event" | "Item";
  likeable_id: number;
}

export interface Item {
  id: number;
  title: string;
  price: number;
  image_url: string;
  category: string;
  description?: string;
}
