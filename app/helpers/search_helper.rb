# frozen_string_literal: true

module SearchHelper
  MAX_RESULTS_PER_PAGE = 5

  def query(resource, query_params)
    cursor = query_params[:after_cursor]
    case resource
    when "Users"
      results = UsersQuery.new(query_params).results(cursor: cursor, limit: MAX_RESULTS_PER_PAGE + 1)
      template = "/users/circuitverse/search"
    when "Projects"
      results = ProjectsQuery.new(query_params, Project.public_and_not_forked).results(cursor: cursor, limit: MAX_RESULTS_PER_PAGE + 1)
      template = "/projects/search"
    else
      results = []
      template = nil
    end

    # Determine if there are more results
    has_next_page = results.size > MAX_RESULTS_PER_PAGE
    results = results.take(MAX_RESULTS_PER_PAGE) # Limit to the desired page size
    next_cursor = has_next_page ? results.last.id : nil

    [results, template, has_next_page, next_cursor]
  end
end