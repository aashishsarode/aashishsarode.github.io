---
layout: page
permalink: /repositories/
title: repositories
description: Research software, satellite systems, and the infrastructure behind them.
nav: true
nav_order: 4
---

This page collects the software and technical work I maintain alongside my research in space robotics.

{% if site.data.repositories.github_repos %}
  <div class="repositories-grid">
    {% for repo in site.data.repositories.github_repos %}
      {% include repository/repo.liquid repository=repo %}
    {% endfor %}
  </div>
{% endif %}

<div class="repository-profile">
  <div>
    <span class="repository-kicker">Open-source profile</span>
    <h2>More work on GitHub</h2>
    <p>Code, experiments, and research tooling are available on my GitHub profile.</p>
  </div>
  {% for user in site.data.repositories.github_users %}
    <a class="repository-profile-link" href="https://github.com/{{ user }}">Visit @{{ user }} <span aria-hidden="true">-&gt;</span></a>
  {% endfor %}
</div>
