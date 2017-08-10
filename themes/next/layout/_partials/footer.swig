<div class="copyright" >
  {% set current = date(Date.now(), "YYYY") %}
  &copy; {% if theme.since and theme.since != current %} {{ theme.since }} - {% endif %}
  <span itemprop="copyrightYear">{{ current }}</span>
  <span class="with-love">
    <i class="fa fa-{{ theme.authoricon }}"></i>
  </span>
  <span class="author" itemprop="copyrightHolder">{{ config.author }}</span>
    <span class="with-love">
    <i class="icon-next-heart"></i>
  </span>
  <span class="with-love">
    <a href="http://www.reliablecounter.com" target="_blank">
      <img src="http://www.reliablecounter.com/count.php?page=www.surebrz.com2&digit=style/scoreboards/9/&reloads=1" alt="www.reliablecounter.com" title="www.reliablecounter.com" border="0">
    </a>
  </span>
</div>

{% if theme.copyright %}
<div class="powered-by">
  {{ __('footer.powered', '<a class="theme-link" href="https://hexo.io">Hexo</a>') }}
</div>

<div class="theme-info">
  {{ __('footer.theme') }} -
  <a class="theme-link" href="https://github.com/iissnan/hexo-theme-next">
    NexT.{{ theme.scheme }}
  </a>
</div>
{% endif %}
