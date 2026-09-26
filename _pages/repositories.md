---
layout: page
permalink: /repositories/
title: repositories
description: Research software, satellite systems, and the infrastructure behind them.
nav: true
nav_order: 4
---

This page collects the software and technical work I maintain alongside my research in space robotics.

<div class="github-generated-assets">
  <img src="{{ '/assets/generated/github-profile.svg' | relative_url }}" alt="GitHub profile summary for @aashishsarode">
  <img src="{{ '/assets/generated/github-repositories.svg' | relative_url }}" alt="Selected GitHub repositories for @aashishsarode">
</div>

<p class="repository-refresh-note">Generated from the GitHub API by GitHub Actions and refreshed weekly.</p>

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
