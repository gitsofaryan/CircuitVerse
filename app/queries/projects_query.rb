# frozen_string_literal: true

class ProjectsQuery
  def initialize(params, relation = Project.all)
    @params = params
    @relation = relation
  end

  def results(cursor: nil, limit: 6)
    query = @params[:query]
    results = @relation
    results = results.text_search(query) if query.present?
    results = results.order(created_at: :desc, id: :desc)
    results = results.where("id < ?", cursor) if cursor.present?
    results.limit(limit)
  end
end