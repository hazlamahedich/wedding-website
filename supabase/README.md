# Supabase Setup for Wedding Website

This directory contains the necessary files to set up Supabase for the wedding website's RSVP functionality.

## Getting Started

1. Create a Supabase account at [https://supabase.com](https://supabase.com)
2. Create a new project in Supabase
3. Get your project URL and anon key from the API settings

## Environment Variables

Create a `.env` file in the root of the project with the following variables:

```
REACT_APP_SUPABASE_URL=your-supabase-url
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Database Setup

You can set up the database in two ways:

### Option 1: Using the SQL Editor in Supabase Dashboard

1. Go to the SQL Editor in your Supabase dashboard
2. Copy the contents of `migrations/20240314_create_rsvps_table.sql`
3. Paste into the SQL Editor and run the query

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

1. Link your project: `supabase link --project-ref your-project-ref`
2. Push the migrations: `supabase db push`

## Table Structure

The RSVP table has the following structure:

- `id`: UUID (primary key)
- `name`: TEXT (required)
- `email`: TEXT (required)
- `attending`: TEXT (required)
- `number_of_guests`: INTEGER (required)
- `dietary_restrictions`: TEXT (optional)
- `message`: TEXT (optional)
- `needs_accommodation`: BOOLEAN (defaults to FALSE)
- `created_at`: TIMESTAMP WITH TIME ZONE (defaults to NOW())
- `updated_at`: TIMESTAMP WITH TIME ZONE (defaults to NOW())

## Row Level Security (RLS)

The table has RLS enabled with the following policies:

- Anonymous users can insert new RSVPs
- Only authenticated users can read RSVPs

## Testing

You can test the RSVP functionality by:

1. Starting the React app: `npm start`
2. Filling out the RSVP form
3. Checking the Supabase dashboard to see if the data was saved correctly

## Troubleshooting

If you encounter issues:

1. Check the browser console for error messages
2. Verify your environment variables are set correctly
3. Check the Supabase dashboard for any policy issues
4. Ensure the table structure matches what's expected in the code 