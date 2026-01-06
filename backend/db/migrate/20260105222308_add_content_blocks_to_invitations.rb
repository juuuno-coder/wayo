class AddContentBlocksToInvitations < ActiveRecord::Migration[8.1]
    add_column :invitations, :content_blocks, :jsonb, default: []
end
