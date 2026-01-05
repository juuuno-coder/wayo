# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_01_05_052324) do
  create_table "active_storage_attachments", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.bigint "record_id", null: false
    t.string "record_type", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.string "content_type"
    t.datetime "created_at", null: false
    t.string "filename", null: false
    t.string "key", null: false
    t.text "metadata"
    t.string "service_name", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "cart_items", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.integer "item_id", null: false
    t.integer "quantity", default: 1
    t.datetime "updated_at", null: false
    t.integer "user_id", null: false
    t.index ["item_id"], name: "index_cart_items_on_item_id"
    t.index ["user_id"], name: "index_cart_items_on_user_id"
  end

  create_table "comments", force: :cascade do |t|
    t.string "comment_type"
    t.integer "commentable_id"
    t.string "commentable_type"
    t.text "content"
    t.datetime "created_at", null: false
    t.integer "parent_id"
    t.datetime "updated_at", null: false
    t.integer "user_id", null: false
    t.index ["commentable_type", "commentable_id"], name: "index_comments_on_commentable_type_and_commentable_id"
    t.index ["user_id"], name: "index_comments_on_user_id"
  end

  create_table "event_reports", force: :cascade do |t|
    t.text "content"
    t.datetime "created_at", null: false
    t.string "date_info"
    t.string "location"
    t.string "report_type"
    t.string "status"
    t.string "title"
    t.datetime "updated_at", null: false
    t.integer "user_id", null: false
    t.index ["user_id"], name: "index_event_reports_on_user_id"
  end

  create_table "events", force: :cascade do |t|
    t.string "approval_status", default: "pending"
    t.string "category"
    t.datetime "crawled_at"
    t.datetime "created_at", null: false
    t.text "description"
    t.date "end_date"
    t.string "image_url"
    t.boolean "is_free", default: false
    t.string "location"
    t.string "organizer"
    t.string "price"
    t.string "region"
    t.string "source_url"
    t.date "start_date"
    t.string "title"
    t.datetime "updated_at", null: false
    t.string "website_url"
  end

  create_table "invitation_guests", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.integer "invitation_id", null: false
    t.text "message"
    t.string "name"
    t.string "status"
    t.datetime "updated_at", null: false
    t.integer "user_id"
    t.index ["invitation_id"], name: "index_invitation_guests_on_invitation_id"
    t.index ["user_id"], name: "index_invitation_guests_on_user_id"
  end

  create_table "invitations", force: :cascade do |t|
    t.string "bgm"
    t.string "cover_image_url"
    t.datetime "created_at", null: false
    t.text "description"
    t.datetime "event_date"
    t.integer "event_id"
    t.string "font_style"
    t.string "location"
    t.string "text_effect"
    t.string "theme_color"
    t.string "theme_ribbon"
    t.integer "ticket_type_id"
    t.string "title"
    t.datetime "updated_at", null: false
    t.integer "user_id"
    t.index ["event_id"], name: "index_invitations_on_event_id"
    t.index ["ticket_type_id"], name: "index_invitations_on_ticket_type_id"
    t.index ["user_id"], name: "index_invitations_on_user_id"
  end

  create_table "items", force: :cascade do |t|
    t.string "category"
    t.datetime "created_at", null: false
    t.text "description"
    t.string "image_url"
    t.integer "price"
    t.string "title"
    t.datetime "updated_at", null: false
  end

  create_table "likes", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.integer "likeable_id", null: false
    t.string "likeable_type", null: false
    t.datetime "updated_at", null: false
    t.integer "user_id", null: false
    t.index ["likeable_type", "likeable_id"], name: "index_likes_on_likeable"
    t.index ["user_id"], name: "index_likes_on_user_id"
  end

  create_table "order_items", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.integer "item_id", null: false
    t.integer "order_id", null: false
    t.integer "price"
    t.integer "quantity"
    t.datetime "updated_at", null: false
    t.index ["item_id"], name: "index_order_items_on_item_id"
    t.index ["order_id"], name: "index_order_items_on_order_id"
  end

  create_table "orders", force: :cascade do |t|
    t.string "buyer_name"
    t.string "buyer_phone"
    t.datetime "created_at", null: false
    t.string "merchant_uid"
    t.string "shipping_address"
    t.string "status"
    t.integer "total_price"
    t.datetime "updated_at", null: false
    t.integer "user_id", null: false
    t.index ["user_id"], name: "index_orders_on_user_id"
  end

  create_table "payments", force: :cascade do |t|
    t.integer "amount", null: false
    t.datetime "created_at", null: false
    t.string "imp_uid"
    t.string "merchant_uid", null: false
    t.integer "order_id", null: false
    t.datetime "paid_at"
    t.string "pay_method"
    t.string "receipt_url"
    t.string "status", default: "ready", null: false
    t.datetime "updated_at", null: false
    t.integer "user_id", null: false
    t.index ["imp_uid"], name: "index_payments_on_imp_uid", unique: true
    t.index ["merchant_uid"], name: "index_payments_on_merchant_uid", unique: true
    t.index ["order_id"], name: "index_payments_on_order_id"
    t.index ["user_id"], name: "index_payments_on_user_id"
  end

  create_table "posts", force: :cascade do |t|
    t.string "category"
    t.integer "comments_count"
    t.text "content"
    t.datetime "created_at", null: false
    t.string "image_url"
    t.integer "likes_count"
    t.string "title"
    t.datetime "updated_at", null: false
    t.integer "user_id", null: false
    t.index ["user_id"], name: "index_posts_on_user_id"
  end

  create_table "reviews", force: :cascade do |t|
    t.text "content"
    t.datetime "created_at", null: false
    t.integer "rating"
    t.integer "reviewable_id", null: false
    t.string "reviewable_type", null: false
    t.datetime "updated_at", null: false
    t.integer "user_id", null: false
    t.index ["reviewable_type", "reviewable_id"], name: "index_reviews_on_reviewable"
    t.index ["user_id"], name: "index_reviews_on_user_id"
  end

  create_table "ticket_types", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.text "description"
    t.integer "event_id", null: false
    t.string "name"
    t.integer "price"
    t.integer "quantity"
    t.datetime "updated_at", null: false
    t.index ["event_id"], name: "index_ticket_types_on_event_id"
  end

  create_table "tickets", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.integer "invitation_guest_id"
    t.string "qr_code"
    t.string "status"
    t.integer "ticket_type_id", null: false
    t.datetime "updated_at", null: false
    t.datetime "used_at"
    t.integer "user_id"
    t.index ["invitation_guest_id"], name: "index_tickets_on_invitation_guest_id"
    t.index ["ticket_type_id"], name: "index_tickets_on_ticket_type_id"
    t.index ["user_id"], name: "index_tickets_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.text "interests"
    t.string "location"
    t.string "nickname"
    t.datetime "remember_created_at"
    t.datetime "reset_password_sent_at"
    t.string "reset_password_token"
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  create_table "visits", force: :cascade do |t|
    t.text "content"
    t.datetime "created_at", null: false
    t.json "decoration_metadata"
    t.integer "event_id", null: false
    t.json "images"
    t.datetime "updated_at", null: false
    t.integer "user_id", null: false
    t.datetime "visited_at"
    t.index ["event_id"], name: "index_visits_on_event_id"
    t.index ["user_id"], name: "index_visits_on_user_id"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "cart_items", "items"
  add_foreign_key "cart_items", "users"
  add_foreign_key "comments", "users"
  add_foreign_key "event_reports", "users"
  add_foreign_key "invitation_guests", "invitations"
  add_foreign_key "invitation_guests", "users"
  add_foreign_key "invitations", "events"
  add_foreign_key "invitations", "ticket_types"
  add_foreign_key "invitations", "users"
  add_foreign_key "likes", "users"
  add_foreign_key "order_items", "items"
  add_foreign_key "order_items", "orders"
  add_foreign_key "orders", "users"
  add_foreign_key "payments", "orders"
  add_foreign_key "payments", "users"
  add_foreign_key "posts", "users"
  add_foreign_key "reviews", "users"
  add_foreign_key "ticket_types", "events"
  add_foreign_key "tickets", "invitation_guests"
  add_foreign_key "tickets", "ticket_types"
  add_foreign_key "tickets", "users"
  add_foreign_key "visits", "events"
  add_foreign_key "visits", "users"
end
