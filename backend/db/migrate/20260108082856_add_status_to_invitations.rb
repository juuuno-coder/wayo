class AddStatusToInvitations < ActiveRecord::Migration[8.1]
  class Invitation < ActiveRecord::Base; end

  def up
    add_column :invitations, :status, :string, default: 'draft'

    Invitation.reset_column_information
    Invitation.where(is_draft: false).update_all(status: 'published')
    Invitation.where(is_draft: true).update_all(status: 'draft')

    remove_column :invitations, :is_draft
  end

  def down
    add_column :invitations, :is_draft, :boolean, default: true

    Invitation.reset_column_information
    Invitation.where(status: 'published').update_all(is_draft: false)
    Invitation.where(status: 'draft').update_all(is_draft: true)

    remove_column :invitations, :status
  end
end
