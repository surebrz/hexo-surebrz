title: RMVA 使用TexturePacker打包的图集
date: 2016-05-13 10:03:52
tags: [ruby,rmva]
categories: 成品
---

试着读取tp图集，对旋转后的图片没有什么好的还原思路，bitmap没办法旋转，目前是创建精灵然后旋转，不建议勾选。
<!--more-->

````ruby
=begin
读取TexturePacker导出的cocos格式plist图集
rotated旋转后的图片在rm中不便还原为原bitmap，编辑图集时不建议勾选Allow rotation
                                  -- by 烁灵
用法：
    取得plist中图片对应的bitmap
    PlistManager.bitmap(plist_name, pic_name)
    
    取得plist中图片对应的rect
    PlistManager.rect(plist_name, pic_name)
    
    根据plist和图片名创建精灵
    sprite = Sprite_Plist.new(plist_name, pic_name, viewport)
=end
# ruby 1.9.1 lib
class CGI
  @@accept_charset="UTF-8" unless defined?(@@accept_charset)
  # URL-encode a string.
  #   url_encoded_string = CGI::escape("'Stop!' said Fred")
  #      # => "%27Stop%21%27+said+Fred"
  def CGI::escape(string)
    string.gsub(/([^ a-zA-Z0-9_.-]+)/) do
      '%' + $1.unpack('H2' * $1.bytesize).join('%').upcase
    end.tr(' ', '+')
  end

  # URL-decode a string with encoding(optional).
  #   string = CGI::unescape("%27Stop%21%27+said+Fred")
  #      # => "'Stop!' said Fred"
  def CGI::unescape(string,encoding=@@accept_charset)
    str=string.tr('+', ' ').force_encoding(Encoding::ASCII_8BIT).gsub(/((?:%[0-9a-fA-F]{2})+)/) do
      [$1.delete('%')].pack('H*')
    end.force_encoding(encoding)
    str.valid_encoding? ? str : str.force_encoding(string.encoding)
  end

  # The set of special characters and their escaped values
  TABLE_FOR_ESCAPE_HTML__ = {
    '&' => '&amp;',
    '"' => '&quot;',
    '<' => '&lt;',
    '>' => '&gt;',
  }

  # Escape special characters in HTML, namely &\"<>
  #   CGI::escapeHTML('Usage: foo "bar" <baz>')
  #      # => "Usage: foo &quot;bar&quot; &lt;baz&gt;"
  def CGI::escapeHTML(string)
    string.gsub(/[&\"<>]/, TABLE_FOR_ESCAPE_HTML__)
  end

  # Unescape a string that has been HTML-escaped
  #   CGI::unescapeHTML("Usage: foo &quot;bar&quot; &lt;baz&gt;")
  #      # => "Usage: foo \"bar\" <baz>"
  def CGI::unescapeHTML(string)
    enc = string.encoding
    if [Encoding::UTF_16BE, Encoding::UTF_16LE, Encoding::UTF_32BE, Encoding::UTF_32LE].include?(enc)
      return string.gsub(Regexp.new('&(amp|quot|gt|lt|#[0-9]+|#x[0-9A-Fa-f]+);'.encode(enc))) do
        case $1.encode("US-ASCII")
        when 'amp'                 then '&'.encode(enc)
        when 'quot'                then '"'.encode(enc)
        when 'gt'                  then '>'.encode(enc)
        when 'lt'                  then '<'.encode(enc)
        when /\A#0*(\d+)\z/        then $1.to_i.chr(enc)
        when /\A#x([0-9a-f]+)\z/i  then $1.hex.chr(enc)
        end
      end
    end
    asciicompat = Encoding.compatible?(string, "a")
    string.gsub(/&(amp|quot|gt|lt|\#[0-9]+|\#x[0-9A-Fa-f]+);/) do
      match = $1.dup
      case match
      when 'amp'                 then '&'
      when 'quot'                then '"'
      when 'gt'                  then '>'
      when 'lt'                  then '<'
      when /\A#0*(\d+)\z/
        n = $1.to_i
        if enc == Encoding::UTF_8 or
          enc == Encoding::ISO_8859_1 && n < 256 or
          asciicompat && n < 128
          n.chr(enc)
        else
          "&##{$1};"
        end
      when /\A#x([0-9a-f]+)\z/i
        n = $1.hex
        if enc == Encoding::UTF_8 or
          enc == Encoding::ISO_8859_1 && n < 256 or
          asciicompat && n < 128
          n.chr(enc)
        else
          "&#x#{$1};"
        end
      else
        "&#{match};"
      end
    end
  end

  # Synonym for CGI::escapeHTML(str)
  def CGI::escape_html(str)
    escapeHTML(str)
  end
  
  # Synonym for CGI::unescapeHTML(str)
  def CGI::unescape_html(str)
    unescapeHTML(str)
  end

  # Escape only the tags of certain HTML elements in +string+.
  #
  # Takes an element or elements or array of elements.  Each element
  # is specified by the name of the element, without angle brackets.
  # This matches both the start and the end tag of that element.
  # The attribute list of the open tag will also be escaped (for
  # instance, the double-quotes surrounding attribute values).
  #
  #   print CGI::escapeElement('<BR><A HREF="url"></A>', "A", "IMG")
  #     # "<BR>&lt;A HREF=&quot;url&quot;&gt;&lt;/A&gt"
  #
  #   print CGI::escapeElement('<BR><A HREF="url"></A>', ["A", "IMG"])
  #     # "<BR>&lt;A HREF=&quot;url&quot;&gt;&lt;/A&gt"
  def CGI::escapeElement(string, *elements)
    elements = elements[0] if elements[0].kind_of?(Array)
    unless elements.empty?
      string.gsub(/<\/?(?:#{elements.join("|")})(?!\w)(?:.|\n)*?>/i) do
        CGI::escapeHTML($&)
      end
    else
      string
    end
  end

  # Undo escaping such as that done by CGI::escapeElement()
  #
  #   print CGI::unescapeElement(
  #           CGI::escapeHTML('<BR><A HREF="url"></A>'), "A", "IMG")
  #     # "&lt;BR&gt;<A HREF="url"></A>"
  #
  #   print CGI::unescapeElement(
  #           CGI::escapeHTML('<BR><A HREF="url"></A>'), ["A", "IMG"])
  #     # "&lt;BR&gt;<A HREF="url"></A>"
  def CGI::unescapeElement(string, *elements)
    elements = elements[0] if elements[0].kind_of?(Array)
    unless elements.empty?
      string.gsub(/&lt;\/?(?:#{elements.join("|")})(?!\w)(?:.|\n)*?&gt;/i) do
        CGI::unescapeHTML($&)
      end
    else
      string
    end
  end

  # Synonym for CGI::escapeElement(str)
  def CGI::escape_element(str)
    escapeElement(str)
  end
  
  # Synonym for CGI::unescapeElement(str)
  def CGI::unescape_element(str)
    unescapeElement(str)
  end

  # Abbreviated day-of-week names specified by RFC 822
  RFC822_DAYS = %w[ Sun Mon Tue Wed Thu Fri Sat ]

  # Abbreviated month names specified by RFC 822
  RFC822_MONTHS = %w[ Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec ]

  # Format a +Time+ object as a String using the format specified by RFC 1123.
  #
  #   CGI::rfc1123_date(Time.now)
  #     # Sat, 01 Jan 2000 00:00:00 GMT
  def CGI::rfc1123_date(time)
    t = time.clone.gmtime
    return format("%s, %.2d %s %.4d %.2d:%.2d:%.2d GMT",
                RFC822_DAYS[t.wday], t.day, RFC822_MONTHS[t.month-1], t.year,
                t.hour, t.min, t.sec)
  end

  # Prettify (indent) an HTML string.
  #
  # +string+ is the HTML string to indent.  +shift+ is the indentation
  # unit to use; it defaults to two spaces.
  #
  #   print CGI::pretty("<HTML><BODY></BODY></HTML>")
  #     # <HTML>
  #     #   <BODY>
  #     #   </BODY>
  #     # </HTML>
  #
  #   print CGI::pretty("<HTML><BODY></BODY></HTML>", "\t")
  #     # <HTML>
  #     #         <BODY>
  #     #         </BODY>
  #     # </HTML>
  #
  def CGI::pretty(string, shift = "  ")
    lines = string.gsub(/(?!\A)<.*?>/m, "\n\\0").gsub(/<.*?>(?!\n)/m, "\\0\n")
    end_pos = 0
    while end_pos = lines.index(/^<\/(\w+)/, end_pos)
      element = $1.dup
      start_pos = lines.rindex(/^\s*<#{element}/i, end_pos)
      lines[start_pos ... end_pos] = "__" + lines[start_pos ... end_pos].gsub(/\n(?!\z)/, "\n" + shift) + "__"
    end
    lines.gsub(/^((?:#{Regexp::quote(shift)})*)__(?=<\/?\w)/, '\1')
  end
end

#
# = base64.rb: methods for base64-encoding and -decoding strings
#

# The Base64 module provides for the encoding (#encode64, #strict_encode64,
# #urlsafe_encode64) and decoding (#decode64, #strict_decode64,
# #urlsafe_decode64) of binary data using a Base64 representation.
#
# == Example
#
# A simple encoding and decoding.
#
#     require "base64"
#
#     enc   = Base64.encode64('Send reinforcements')
#                         # -> "U2VuZCByZWluZm9yY2VtZW50cw==\n"
#     plain = Base64.decode64(enc)
#                         # -> "Send reinforcements"
#
# The purpose of using base64 to encode data is that it translates any
# binary data into purely printable characters.

module Base64
  module_function

  # Returns the Base64-encoded version of +bin+.
  # This method complies with RFC 2045.
  # Line feeds are added to every 60 encoded charactors.
  #
  #    require 'base64'
  #    Base64.encode64("Now is the time for all good coders\nto learn Ruby")
  #
  # <i>Generates:</i>
  #
  #    Tm93IGlzIHRoZSB0aW1lIGZvciBhbGwgZ29vZCBjb2RlcnMKdG8gbGVhcm4g
  #    UnVieQ==
  def encode64(bin)
    [bin].pack("m")
  end

  # Returns the Base64-decoded version of +str+.
  # This method complies with RFC 2045.
  # Characters outside the base alphabet are ignored.
  #
  #   require 'base64'
  #   str = 'VGhpcyBpcyBsaW5lIG9uZQpUaGlzIG' +
  #         'lzIGxpbmUgdHdvClRoaXMgaXMgbGlu' +
  #         'ZSB0aHJlZQpBbmQgc28gb24uLi4K'
  #   puts Base64.decode64(str)
  #
  # <i>Generates:</i>
  #
  #    This is line one
  #    This is line two
  #    This is line three
  #    And so on...
  def decode64(str)
    str.unpack("m").first
  end

  # Returns the Base64-encoded version of +bin+.
  # This method complies with RFC 4648.
  # No line feeds are added.
  def strict_encode64(bin)
    [bin].pack("m0")
  end

  # Returns the Base64-decoded version of +str+.
  # This method complies with RFC 4648.
  # ArgumentError is raised if +str+ is incorrectly padded or contains
  # non-alphabet characters.  Note that CR or LF are also rejected.
  def strict_decode64(str)
    str.unpack("m0").first
  end

  # Returns the Base64-encoded version of +bin+.
  # This method complies with ``Base 64 Encoding with URL and Filename Safe
  # Alphabet'' in RFC 4648.
  # The alphabet uses '-' instead of '+' and '_' instead of '/'.
  def urlsafe_encode64(bin)
    strict_encode64(bin).tr("+/", "-_")
  end

  # Returns the Base64-decoded version of +str+.
  # This method complies with ``Base 64 Encoding with URL and Filename Safe
  # Alphabet'' in RFC 4648.
  # The alphabet uses '-' instead of '+' and '_' instead of '/'.
  def urlsafe_decode64(str)
    strict_decode64(str.tr("-_", "+/"))
  end
end

# xmlplist parser
# clone from https://github.com/seki/XMLPlist.git
module XMLPlist
  class Emitter
    def initialize
      @fiber = Fiber.new do |it|
        @plist = do_pop(it)
      end
    end
    attr_reader :plist
    
    def push(it)
      @fiber.resume(it)
    end
    
    def on_value(obj)
      push(obj)
    end
    
    def on_stag(name)
      push(name.intern)
    end

    def on_etag(name)
      push(('etag_' + name).intern)
    end

    def dict
      hash = Hash.new
      while key = pop_until(:etag_dict)
        hash[key] = pop
      end
      hash
    end

    def array
      ary = Array.new
      while elem = pop_until(:etag_array)
        ary.push(elem)
      end
      ary
    end
    
    def pop_until(symbol)
      it = pop
      return it unless Symbol === it
      return nil if it == symbol
      raise RuntimeError
    end
    
    def pop
      do_pop(Fiber.yield)
    end

    def do_pop(it)
      case it
      when :dict
        dict
      when :array
        array
      else
        it
      end
    end
  end

  module_function
  def from_file(fname)
    emitter = Emitter.new
    str = File.read(fname)
    str.scan(/<(key|string|data|date|real|integer)>(.*?)<\/\1>|<(true|false)\/>|<(array|dict)>|<\/(array|dict)>/m) do
      if $4
        emitter.on_stag($4)
      elsif $5
        emitter.on_etag($5)
      else
        value = if $1
                  case $1
                  when 'key', 'string'
                    ($2.include?('&')) ? CGI::unescapeHTML($2) : $2
                  when 'data'
                    Base64.decode64($2)
                  when 'date'
                    '' # DateTime.parse($2)
                  when 'real'
                    $2.to_r
                  when 'integer'
                    $2.to_i
                  end
                elsif $3 == 'true'
                  true
                elsif $3 == 'false'
                  false
                else
                  raise RuntimeError
                end
        emitter.on_value(value)
      end
    end
    plist = emitter.plist
  end
end

# PlistManager
module PlistManager
  FRAMES_KEY = "frames"
  FRAME_KEY = "frame"
  ROTATED_KEY = "rotated"
  class << self
      # 加载plist文件
      def load(plist)
        @cache ||= {}
        if not @cache.include?(plist)
          @cache[plist] = XMLPlist.from_file("Graphics/Plists/#{plist}.plist")
        end
        return @cache[plist]
      end
      # 返回pic对应的bitmap
      def bitmap(plist, pic, hue = 0)
        p plist, pic
        orig_bitmap = Cache.load_bitmap("Graphics/Plists/", plist, hue)
        rect = self.rect(plist, pic)
        if rect 
          bitmap = Bitmap.new(rect.width, rect.height)
          bitmap.blt(0, 0, orig_bitmap, rect)
          return bitmap
        else
          return Bitmap.new(1,1)
        end
      end
      # 返回pic对应的rect
      def rect(plist, pic)
        orig_bitmap = Cache.load_bitmap("Graphics/Plists/", plist)
        obj = self.load(plist)
        frame_reg = /{{(\d+)?,(\d+)?},{(\d+)?,(\d+)?}}/im
        p obj[FRAMES_KEY]["#{pic}.png"][FRAME_KEY]
        if obj[FRAMES_KEY]["#{pic}.png"][FRAME_KEY].scan(frame_reg)
          x1 = $1.to_i
          y1 = $2.to_i
          w = $3.to_i
          h = $4.to_i
          if rotated?(plist, pic)
            w, h = h, w
          end
          return  Rect.new(x1, y1, w, h)
        else
          return nil
        end
      end
      # 返回pic是否被旋转
      def rotated?(plist, pic)
        obj = self.load(plist)
        return obj[FRAMES_KEY]["#{pic}.png"][ROTATED_KEY]
      end
  end
end

# Sprite_Plist
class Sprite_Plist < Sprite_Base
  attr_accessor     :plist_name
  attr_accessor     :pic_name
  attr_accessor     :rotated
  def initialize(plist_name, pic_name, viewport=nil)
    super(viewport)
    @plist_name = plist_name
    @pic_name = pic_name
    orig_bitmap = Cache.load_bitmap("Graphics/Plists/", plist_name)
#~     self.bitmap = orig_bitmap 
#~     self.src_rect = PlistManager.rect(plist_name, pic_name)
    self.bitmap = PlistManager.bitmap(plist_name, pic_name)
    @rotated = PlistManager.rotated?(plist_name, pic_name)
    self.angle = 90 if @rotated
    self.x = 0
    self.y = 0
  end
  def width
    return @rotated ? src_rect.height : src_rect.width
  end
  def height
    return @rotated ? src_rect.width : src_rect.height
  end
end

````