Module | Version | Repo
------ | ------- | -----
<% _.each(modules, function(module){ %>
<%= module.name %> | {{module.version}} | [{{module.site}}]
<% }); %>
